import { Injectable } from '@angular/core';
import {AuthService} from './auth';
import {ChallengeProgressService} from './challenge-progress';
import {ChallengeRequestService} from './challenge-request';



export type ChallengeType =
  | 'mandatory'
  | 'optional'
  | 'quiz'
  | 'euskera';

export type ChallengeStatus = 'pending' | 'available' | 'completed';

export interface ChallengeItem {
  id: string;
  title: string;
  description: string;
  type: ChallengeType;
  status: ChallengeStatus;
  rewardLabel?: string;
  level?: 1 | 2 | 3;

  quiz?: {
    question: string;
    options: string[];
    correctIndex: number;
    successMsg: string;
    failMsg: string;
  };

  euskeraQuiz?: {
    question: string;
    options: string[];
    correctIndex: number;
  }[];
}

export interface PendingRequest {
  id: string;
  challengeId: string;
  title: string;
  type: ChallengeType;
  status: 'pending' | 'accepted';
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChallengeService {


  constructor(
    private authService: AuthService,
    private challengeProgressService: ChallengeProgressService,
    private challengeRequestService: ChallengeRequestService
  ) {}

  // ===== RETOS EN FIREBASE =====

  async getChallenges(): Promise<ChallengeItem[]> {
    try {
      const userId = await this.authService.getUserIdAsync();

      return await this.challengeProgressService.getChallenges(userId);

    } catch (error) {
      console.error('Error leyendo retos desde Firestore:', error);
      return [];
    }
  }

  async saveChallenges(
    challenges: ChallengeItem[]
  ): Promise<void> {
    try {
      const userId = await this.authService.getUserIdAsync();

      await this.challengeProgressService.saveChallenges(
        userId,
        challenges
      );

    } catch (error) {
      console.error('Error guardando retos en Firestore:', error);
    }
  }

  async updateChallengeStatus(
    challengeId: string,
    newStatus: ChallengeStatus
  ): Promise<void> {

    const challenges = await this.getChallenges();

    const updatedChallenges = challenges.map(challenge => {
      if (challenge.id === challengeId) {
        return {
          ...challenge,
          status: newStatus
        };
      }

      return challenge;
    });

    await this.saveChallenges(updatedChallenges);
  }

  async resetChallenge(
    challengeId: string
  ): Promise<void> {

    const challenges = await this.getChallenges();

    const updatedChallenges = challenges.map(challenge => {
      if (challenge.id === challengeId) {
        return {
          ...challenge,
          status: 'available' as const
        };
      }

      return challenge;
    });

    await this.saveChallenges(updatedChallenges);

    // Eliminamos de Firebase las solicitudes asociadas al reto
    const userId = await this.authService.getUserIdAsync();

    const requests =
      await this.challengeRequestService.getRequests(userId);

    const relatedRequests = requests.filter(
      request => request.challengeId === challengeId
    );

    for (const request of relatedRequests) {
      await this.challengeRequestService.deleteRequest(
        userId,
        request.id
      );
    }


  }

// ===== SOLICITUDES EN FIREBASE =====

  async getPendingRequests(): Promise<PendingRequest[]> {
    try {
      const userId = await this.authService.getUserIdAsync();

      return await this.challengeRequestService.getRequests(userId);

    } catch (error) {
      console.error('Error leyendo solicitudes:', error);
      return [];
    }
  }

  async hasPendingRequest(
    challengeId: string
  ): Promise<boolean> {
    const requests = await this.getPendingRequests();

    return requests.some(
      request =>
        request.challengeId === challengeId &&
        request.status === 'pending'
    );
  }

  async createPendingRequest(
    challenge: ChallengeItem
  ): Promise<void> {

    console.log('1 - createPendingRequest entra:', challenge.id);

    if (challenge.status === 'completed') {
      console.log('2 - reto ya completado');
      return;
    }

    const userId = await this.authService.getUserIdAsync();

    console.log('3 - UID:', userId);

    const requests =
      await this.challengeRequestService.getRequests(userId);

    console.log('4 - solicitudes actuales:', requests);

    const alreadyRequested = requests.some(
      request => request.challengeId === challenge.id
    );

    if (alreadyRequested) {
      console.log('5 - ya existe solicitud');
      return;
    }

    console.log('6 - creando solicitud...');

    await this.challengeRequestService.createRequest(
      userId,
      {
        challengeId: challenge.id,
        title: challenge.title,
        type: challenge.type,
        status: 'pending',
        createdAt: new Date().toISOString()
      }
    );

    console.log('7 - SOLICITUD CREADA');
  }

  async updateRequestStatus(
    requestId: string,
    newStatus: 'pending' | 'accepted'
  ): Promise<void> {

    const userId = await this.authService.getUserIdAsync();

    await this.challengeRequestService.updateRequestStatus(
      userId,
      requestId,
      newStatus
    );
  }
  async deleteRequest(
    requestId: string
  ): Promise<void> {

    const userId = await this.authService.getUserIdAsync();

    await this.challengeRequestService.deleteRequest(
      userId,
      requestId
    );
  }
}
