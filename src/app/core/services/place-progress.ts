import { Injectable } from '@angular/core';

import {
  Firestore,
  doc,
  getDoc,
  setDoc
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class PlaceProgressService {

  constructor(private firestore: Firestore) {}

  async getUnlockedPlaces(userId: string): Promise<string[]> {
    const progressRef = doc(
      this.firestore,
      `users/${userId}/progress/places`
    );

    const snapshot = await getDoc(progressRef);

    if (!snapshot.exists()) {
      return [];
    }

    const data = snapshot.data();

    return data['unlockedPlaces'] ?? [];
  }

  async saveUnlockedPlaces(
    userId: string,
    unlockedPlaceIds: string[]
  ): Promise<void> {
    const progressRef = doc(
      this.firestore,
      `users/${userId}/progress/places`
    );

    await setDoc(
      progressRef,
      {
        unlockedPlaces: unlockedPlaceIds,
        updatedAt: Date.now()
      },
      { merge: true }
    );
  }
}
