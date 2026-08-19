import { Injectable } from '@angular/core';

import {
  Firestore,
  doc,
  getDoc,
  setDoc
} from '@angular/fire/firestore';

import { ChallengeItem } from './challenge.service';

@Injectable({
  providedIn: 'root'
})
export class ChallengeProgressService {

  constructor(private firestore: Firestore) {}

  async getChallenges(userId: string): Promise<ChallengeItem[]> {
    const progressRef = doc(
      this.firestore,
      `users/${userId}/progress/challenges`
    );

    const snapshot = await getDoc(progressRef);

    if (!snapshot.exists()) {
      return [];
    }

    const data = snapshot.data();

    return data['challenges'] ?? [];
  }

  async saveChallenges(
    userId: string,
    challenges: ChallengeItem[]
  ): Promise<void> {
    const progressRef = doc(
      this.firestore,
      `users/${userId}/progress/challenges`
    );

    await setDoc(
      progressRef,
      {
        challenges,
        updatedAt: Date.now()
      },
      { merge: true }
    );
  }
}
