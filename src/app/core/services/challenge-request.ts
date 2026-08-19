import { Injectable } from '@angular/core';

import {
  Firestore,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy
} from '@angular/fire/firestore';

import { PendingRequest } from './challenge.service';

@Injectable({
  providedIn: 'root'
})
export class ChallengeRequestService {

  constructor(private firestore: Firestore) {}

  async getRequests(userId: string): Promise<PendingRequest[]> {
    const requestsRef = collection(
      this.firestore,
      `users/${userId}/challengeRequests`
    );

    const q = query(
      requestsRef,
      orderBy('createdAt', 'desc')
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map(document => ({
      id: document.id,
      ...(document.data() as Omit<PendingRequest, 'id'>)
    }));
  }

  async createRequest(
    userId: string,
    request: Omit<PendingRequest, 'id'>
  ): Promise<void> {
    const requestsRef = collection(
      this.firestore,
      `users/${userId}/challengeRequests`
    );

    await addDoc(requestsRef, request);
  }

  async updateRequestStatus(
    userId: string,
    requestId: string,
    status: 'pending' | 'accepted'
  ): Promise<void> {
    const requestRef = doc(
      this.firestore,
      `users/${userId}/challengeRequests/${requestId}`
    );

    await updateDoc(requestRef, {
      status
    });
  }

  async deleteRequest(
    userId: string,
    requestId: string
  ): Promise<void> {
    const requestRef = doc(
      this.firestore,
      `users/${userId}/challengeRequests/${requestId}`
    );

    await deleteDoc(requestRef);
  }
}
