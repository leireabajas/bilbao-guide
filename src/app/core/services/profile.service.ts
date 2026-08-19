import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AVATARS } from '../data/avatars.data';

import {
  Firestore,
  doc,
  getDoc,
  setDoc
} from '@angular/fire/firestore';
import {AuthService} from './auth';



@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private avatarSubject = new BehaviorSubject<string | null>(null);

  avatar$ = this.avatarSubject.asObservable();

  constructor(
    private firestore: Firestore,
    private authService: AuthService
  ) {
    this.loadAvatar();
  }

  async saveAvatar(avatarId: string): Promise<void> {
    const userId = await this.authService.getUserIdAsync();

    const userRef = doc(
      this.firestore,
      `users/${userId}`
    );

    await setDoc(
      userRef,
      {
        avatarId,
        updatedAt: Date.now()
      },
      { merge: true }
    );

    this.avatarSubject.next(avatarId);
  }

  async loadAvatar(): Promise<void> {
    try {
      const userId = await this.authService.getUserIdAsync();

      const userRef = doc(
        this.firestore,
        `users/${userId}`
      );

      const snapshot = await getDoc(userRef);

      if (!snapshot.exists()) {
        this.avatarSubject.next(null);
        return;
      }

      const data = snapshot.data();

      this.avatarSubject.next(
        data['avatarId'] ?? null
      );

    } catch (error) {
      console.error('Error cargando avatar:', error);
      this.avatarSubject.next(null);
    }
  }

  getAvatar(): string | null {
    return this.avatarSubject.value;
  }

  getAvatarUrl(): string {
    const avatarId = this.getAvatar();

    const avatar = AVATARS.find(
      a => a.id === avatarId
    );

    return avatar
      ? avatar.imageUrl
      : 'assets/avatars/Harry.png';
  }
}
