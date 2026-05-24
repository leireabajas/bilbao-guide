import { Injectable } from '@angular/core';

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

  // Datos opcionales para retos tipo quiz
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
  private readonly challengesKey = 'passportChallenges';
  private readonly pendingRequestsKey = 'pendingChallengeRequests';

  // Lee todos los retos guardados
  getChallenges(): ChallengeItem[] {
    const data = localStorage.getItem(this.challengesKey);

    if (!data) {
      return [];
    }

    try {
      return JSON.parse(data);
    } catch (error) {
      console.error('Error leyendo passportChallenges:', error);
      return [];
    }
  }

  // Guarda la lista completa de retos
  saveChallenges(challenges: ChallengeItem[]): void {
    localStorage.setItem(this.challengesKey, JSON.stringify(challenges));
  }

  // Actualiza el estado de un reto concreto
  updateChallengeStatus(
    challengeId: string,
    newStatus: ChallengeStatus
  ): void {
    const challenges = this.getChallenges();

    const updatedChallenges = challenges.map(challenge => {
      if (challenge.id === challengeId) {
        return {
          ...challenge,
          status: newStatus
        };
      }

      return challenge;
    });

    this.saveChallenges(updatedChallenges);
  }

  // Lee todas las solicitudes pendientes/aceptadas
  getPendingRequests(): PendingRequest[] {
    const data = localStorage.getItem(this.pendingRequestsKey);

    if (!data) {
      return [];
    }

    try {
      return JSON.parse(data);
    } catch (error) {
      console.error('Error leyendo pendingChallengeRequests:', error);
      return [];
    }
  }

  // Guarda la lista completa de solicitudes
  savePendingRequests(requests: PendingRequest[]): void {
    localStorage.setItem(this.pendingRequestsKey, JSON.stringify(requests));
  }

  // Comprueba si un reto ya tiene solicitud pendiente
  hasPendingRequest(challengeId: string): boolean {
    const requests = this.getPendingRequests();

    return requests.some(
      request =>
        request.challengeId === challengeId &&
        request.status === 'pending'
    );
  }

  // Crea una nueva solicitud de validación si no existe ya
  createPendingRequest(challenge: ChallengeItem): void {
    if (challenge.status === 'completed') {
      return;
    }

    const requests = this.getPendingRequests();

    const alreadyRequested = requests.some(
      request => request.challengeId === challenge.id
    );

    if (alreadyRequested) {
      return;
    }

    const newRequest: PendingRequest = {
      id: `request-${Date.now()}`,
      challengeId: challenge.id,
      title: challenge.title,
      type: challenge.type,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    requests.push(newRequest);
    this.savePendingRequests(requests);
  }

  // Cambia el estado de una solicitud concreta
  updateRequestStatus(
    requestId: string,
    newStatus: 'pending' | 'accepted'
  ): void {
    const requests = this.getPendingRequests();

    const updatedRequests = requests.map(request => {
      if (request.id === requestId) {
        return {
          ...request,
          status: newStatus
        };
      }

      return request;
    });

    this.savePendingRequests(updatedRequests);
  }

  resetChallenge(challengeId: string): void {
    // 1. Reiniciamos el estado del reto
    const challenges = this.getChallenges();

    const updatedChallenges = challenges.map(challenge => {
      if (challenge.id === challengeId) {
        return {
          ...challenge,
          status: 'available' as const
        };
      }

      return challenge;
    });

    this.saveChallenges(updatedChallenges);

    // 2. Eliminamos solicitudes asociadas a ese reto
    const requests = this.getPendingRequests();

    const filteredRequests = requests.filter(
      request => request.challengeId !== challengeId
    );

    this.savePendingRequests(filteredRequests);
  }
}
