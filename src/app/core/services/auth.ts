import { Injectable } from '@angular/core';

import {
  Auth,
  signInAnonymously,
  onAuthStateChanged,
  User
} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  currentUser: User | null = null;

  constructor(private auth: Auth) {
    this.initAuth();
  }

  private async initAuth(): Promise<void> {
    try {

      // Login anónimo automático
      await signInAnonymously(this.auth);

      // Escuchar cambios de usuario
      onAuthStateChanged(this.auth, (user) => {
        this.currentUser = user;

        console.log('Usuario Firebase:', user);
      });

    } catch (error) {
      console.error('Error autenticando:', error);
    }
  }

  getUserId(): string | null {
    return this.currentUser?.uid ?? null;
  }
}
