import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileService } from '../../core/services/profile.service';
import { RewardService } from '../../core/services/reward.service';
import { AdminService } from '../../core/services/admin.service';

import {
  ChallengeService,
  PendingRequest,
  ChallengeType
} from '../../core/services/challenge.service';

import {
  RewardClaimRequest
} from '../../core/data/rewards.data';

@Component({
  selector: 'app-pending-requests',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pending-requests.html',
  styleUrls: ['./pending-requests.scss']
})
export class PendingRequestsComponent implements OnInit {

  selectedAvatar: string | null = null;

  // Solicitudes de retos
  requests: PendingRequest[] = [];

  // Solicitudes de recompensa
  // Por ahora siguen usando RewardService/localStorage
  rewardRequests: RewardClaimRequest[] = [];

  constructor(
    private profileService: ProfileService,
    private challengeService: ChallengeService,
    private rewardService: RewardService,
    private adminService: AdminService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit(): Promise<void> {
    this.selectedAvatar =
      this.profileService.getAvatarUrl();

    this.rewardRequests =
      this.rewardService.getRewardRequests();

    await this.loadRequests();

    this.cdr.detectChanges();
  }

  // =========================================================
  // GETTERS
  // =========================================================

  get pendingRequests(): PendingRequest[] {
    return this.requests.filter(
      request => request.status === 'pending'
    );
  }

  get acceptedRequests(): PendingRequest[] {
    return this.requests.filter(
      request => request.status === 'accepted'
    );
  }

  get pendingRewardRequests(): RewardClaimRequest[] {
    return this.rewardRequests.filter(
      request => request.status === 'pending'
    );
  }

  get acceptedRewardRequests(): RewardClaimRequest[] {
    return this.rewardRequests.filter(
      request => request.status === 'accepted'
    );
  }

  // =========================================================
  // SOLICITUDES DE RETOS - FIREBASE
  // =========================================================

  private async loadRequests(): Promise<void> {
    try {
      this.requests =
        await this.challengeService.getPendingRequests();

      console.log(
        'ADMIN: solicitudes recibidas:',
        this.requests
      );

      this.cdr.detectChanges();

    } catch (error) {
      console.error(
        'ADMIN: error cargando solicitudes:',
        error
      );

      this.requests = [];

      this.cdr.detectChanges();
    }
  }

  /**
   * Acepta una solicitud:
   * - solicitud -> accepted
   * - reto -> completed
   */
  async acceptRequest(
    requestId: string
  ): Promise<void> {

    const request =
      this.requests.find(
        req => req.id === requestId
      );

    if (!request) {
      return;
    }

    try {

      await this.challengeService.updateRequestStatus(
        requestId,
        'accepted'
      );

      await this.challengeService.updateChallengeStatus(
        request.challengeId,
        'completed'
      );

      await this.loadRequests();

    } catch (error) {

      console.error(
        'Error aceptando solicitud:',
        error
      );
    }
  }

  /**
   * Devuelve una solicitud aceptada a pending
   * y el reto vuelve a available.
   */
  async undoAcceptRequest(
    requestId: string
  ): Promise<void> {

    const request =
      this.requests.find(
        req => req.id === requestId
      );

    if (!request) {
      return;
    }

    try {

      await this.challengeService.updateRequestStatus(
        requestId,
        'pending'
      );

      await this.challengeService.updateChallengeStatus(
        request.challengeId,
        'available'
      );

      await this.loadRequests();

    } catch (error) {

      console.error(
        'Error deshaciendo aceptación:',
        error
      );
    }
  }

  /**
   * Elimina la solicitud y reinicia el reto.
   */
  async resetChallengeRequest(
    requestId: string
  ): Promise<void> {

    const request =
      this.requests.find(
        req => req.id === requestId
      );

    if (!request) {
      return;
    }

    try {

      await this.challengeService.deleteRequest(
        requestId
      );

      await this.challengeService.updateChallengeStatus(
        request.challengeId,
        'available'
      );

      await this.loadRequests();

    } catch (error) {

      console.error(
        'Error reiniciando solicitud:',
        error
      );
    }
  }

  // =========================================================
  // RECOMPENSAS
  // Por ahora todavía siguen con RewardService/localStorage
  // =========================================================

  acceptRewardRequest(
    requestId: string
  ): void {

    this.rewardService.acceptRewardRequest(
      requestId
    );

    this.rewardRequests =
      this.rewardService.getRewardRequests();
  }

  deleteRewardRequest(
    requestId: string
  ): void {

    this.rewardService.deleteRewardRequest(
      requestId
    );

    this.rewardRequests =
      this.rewardService.getRewardRequests();
  }

  undoAcceptRewardRequest(
    requestId: string
  ): void {

    this.rewardService.undoAcceptRewardRequest(
      requestId
    );

    this.rewardRequests =
      this.rewardService.getRewardRequests();
  }

  // =========================================================
  // TEXTOS
  // =========================================================

  getTypeLabel(
    type: ChallengeType
  ): string {

    if (type === 'mandatory') {
      return 'Obligatorio';
    }

    if (type === 'optional') {
      return 'Opcional';
    }

    if (type === 'quiz') {
      return 'Quiz Bilbao';
    }

    return 'Euskera';
  }

  // =========================================================
  // HERRAMIENTAS ADMIN
  // NOTA: algunas todavía usan localStorage porque aún
  // no hemos migrado esas partes.
  // =========================================================

  resetAllData(): void {

    // Aún no lo adaptamos a Firebase.
    // No lo uses todavía para resetear retos/lugares,
    // porque esas partes ya están en Firestore.

    localStorage.removeItem('passportRewards');
    localStorage.removeItem('rewardClaimRequests');
    localStorage.removeItem('euskeraQuizProgress');
    localStorage.removeItem('euskeraHistory');
    localStorage.removeItem('rewardedEuskeraLevels');
    localStorage.removeItem('rewardedBilbaoLevels');

    this.rewardRequests = [];
  }

  resetChallengesData(): void {

    // Los retos ya están en Firebase.
    // Lo adaptaremos cuando hagamos el reset admin real.

    localStorage.removeItem('euskeraQuizProgress');
    localStorage.removeItem('euskeraHistory');
    localStorage.removeItem('rewardedEuskeraLevels');
    localStorage.removeItem('rewardedBilbaoLevels');

    this.requests = [];
  }

  resetRewardsData(): void {

    localStorage.removeItem(
      'passportRewards'
    );

    localStorage.removeItem(
      'rewardClaimRequests'
    );

    this.rewardRequests = [];
  }

  resetPlacesData(): void {
    // Los lugares ya están en Firebase.
    // Lo adaptaremos después.
  }

  resetPlacePhotos(): void {
    // Las fotos ya están en Firebase Storage.
    // NO borrar localStorage aquí.
    // Luego crearemos un reset real de Storage.
  }

  resetAvatar(): void {
    // El avatar ya está en Firestore.
    // Lo adaptaremos después.
  }

  resetAdminMode(): void {

    localStorage.removeItem('adminMode');

    this.adminService.disableAdmin();
  }
}
