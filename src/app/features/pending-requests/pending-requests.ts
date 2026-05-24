import { Component, OnInit } from '@angular/core';
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
  RewardClaimRequest,
  RewardItem
} from '../../core/data/rewards.data';

@Component({
  selector: 'app-pending-requests',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pending-requests.html',
  styleUrls: ['./pending-requests.scss']
})
export class PendingRequestsComponent implements OnInit {
  // Avatar para mantener coherencia con el resto de pantallas
  selectedAvatar: string | null = null;

  // Solicitudes de retos
  requests: PendingRequest[] = [];

  // Solicitudes de recompensa
  rewardRequests: RewardClaimRequest[] = [];

  constructor(
    private profileService: ProfileService,
    private challengeService: ChallengeService,
    private rewardService: RewardService,
    private adminService: AdminService
  ) {}

  ngOnInit(): void {
    this.selectedAvatar = this.profileService.getAvatarUrl();
    this.rewardRequests = this.rewardService.getRewardRequests();
    this.loadRequests();

  }

  /**
   * Solicitudes de retos pendientes.
   */
  get pendingRequests(): PendingRequest[] {
    return this.requests.filter(request => request.status === 'pending');
  }

  /**
   * Solicitudes de retos aceptadas.
   */
  get acceptedRequests(): PendingRequest[] {
    return this.requests.filter(request => request.status === 'accepted');
  }

  /**
   * Solicitudes de recompensa pendientes.
   */
  get pendingRewardRequests(): RewardClaimRequest[] {
    return this.rewardRequests.filter(request => request.status === 'pending');
  }

  /**
   * Solicitudes de recompensa aceptadas.
   */
  get acceptedRewardRequests(): RewardClaimRequest[] {
    return this.rewardRequests.filter(request => request.status === 'accepted');
  }

  /**
   * Carga las solicitudes de retos desde localStorage.
   */
  private loadRequests(): void {
    this.requests = this.challengeService.getPendingRequests();
  }

  /**
   * Guarda las solicitudes de retos.
   */
  private saveRequests(): void {
    this.challengeService.savePendingRequests(this.requests);
  }


  /**
   * Acepta una solicitud de reto y marca el reto asociado como completed.
   */
  acceptRequest(requestId: string): void {
    const request = this.requests.find(req => req.id === requestId);

    if (!request) return;

    // Actualizamos la solicitud en memoria
    this.requests = this.requests.map(req =>
      req.id === requestId
        ? { ...req, status: 'accepted' }
        : req
    );

    // Guardamos solicitudes
    this.saveRequests();

    // Marcamos el reto como completado
    this.challengeService.updateChallengeStatus(request.challengeId, 'completed');
  }

  /**
   * Deshace una aceptación de reto y lo devuelve a available.
   */
  undoAcceptRequest(requestId: string): void {
    const request = this.requests.find(req => req.id === requestId);

    if (!request) return;

    // La solicitud vuelve a pending
    this.requests = this.requests.map(req =>
      req.id === requestId
        ? { ...req, status: 'pending' }
        : req
    );

    // Guardamos solicitudes
    this.saveRequests();

    // El reto vuelve a disponible
    this.challengeService.updateChallengeStatus(request.challengeId, 'available');
  }

  /**
   * Acepta una solicitud de recompensa:
   * - marca la solicitud como accepted
   * - cambia la recompensa a used
   */
  acceptRewardRequest(requestId: string): void {
    this.rewardService.acceptRewardRequest(requestId);
    this.rewardRequests = this.rewardService.getRewardRequests();
  }

  /**
   * Borra una solicitud de recompensa pendiente:
   * - elimina la solicitud
   * - devuelve la recompensa a available
   */
  deleteRewardRequest(requestId: string): void {
    this.rewardService.deleteRewardRequest(requestId);
    this.rewardRequests = this.rewardService.getRewardRequests();
  }

  /**
   * Deshace una aceptación de recompensa:
   * - devuelve la solicitud a pending
   * - devuelve la recompensa a available
   */
  undoAcceptRewardRequest(requestId: string): void {
    this.rewardService.undoAcceptRewardRequest(requestId);
    this.rewardRequests = this.rewardService.getRewardRequests();
  }

  /**
   * Texto bonito para mostrar el tipo de reto.
   */
  getTypeLabel(type: ChallengeType): string {
    if (type === 'mandatory') return 'Obligatorio';
    if (type === 'optional') return 'Opcional';
    if (type === 'quiz') return 'Quiz Bilbao';
    return 'Euskera';
  }

  resetChallengeRequest(requestId: string): void {
    const request = this.requests.find(req => req.id === requestId);

    if (!request) return;

    // 1. Eliminamos la solicitud
    this.requests = this.requests.filter(req => req.id !== requestId);
    this.saveRequests();

    // 2. Reiniciamos el reto
    this.challengeService.updateChallengeStatus(request.challengeId, 'available');
  }

  resetAllData(): void {
    localStorage.removeItem('passportChallenges');
    localStorage.removeItem('passportRewards');
    localStorage.removeItem('rewardClaimRequests');
    localStorage.removeItem('pendingChallengeRequests');
    localStorage.removeItem('unlockedPlaces');
    localStorage.removeItem('euskeraQuizProgress');
    localStorage.removeItem('euskeraHistory');
    localStorage.removeItem('rewardedEuskeraLevels');
    localStorage.removeItem('rewardedBilbaoLevels');
    localStorage.removeItem('placePhotoAlbums');

    this.requests = [];
    this.rewardRequests = [];
  }

  resetChallengesData(): void {
    localStorage.removeItem('passportChallenges');
    localStorage.removeItem('pendingChallengeRequests');
    localStorage.removeItem('euskeraQuizProgress');
    localStorage.removeItem('euskeraHistory');
    localStorage.removeItem('rewardedEuskeraLevels');
    localStorage.removeItem('rewardedBilbaoLevels');

    this.requests = [];
  }

  resetRewardsData(): void {
    localStorage.removeItem('passportRewards');
    localStorage.removeItem('rewardClaimRequests');

    this.rewardRequests = [];
  }

  resetPlacesData(): void {
    localStorage.removeItem('unlockedPlaces');
  }

  resetPlacePhotos(): void {
    localStorage.removeItem('placePhotoAlbums');
  }

  resetAvatar(): void {
    localStorage.removeItem('selectedAvatar');
  }

  resetAdminMode(): void {
    localStorage.removeItem('adminMode');
    this.adminService.disableAdmin();
  }
}
