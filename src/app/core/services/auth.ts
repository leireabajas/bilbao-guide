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

  private authReadyPromise: Promise<User>;

  constructor(private auth: Auth) {

    this.authReadyPromise = new Promise<User>((resolve, reject) => {

      onAuthStateChanged(
        this.auth,

        async (user) => {

          if (user) {
            this.currentUser = user;
            resolve(user);
            return;
          }

          try {
            const credential = await signInAnonymously(this.auth);

            this.currentUser = credential.user;

            resolve(credential.user);

          } catch (error) {

            console.error('Error autenticando:', error);
            reject(error);

          }
        },

        (error) => {
          console.error('Error escuchando Auth:', error);
          reject(error);
        }

      );

    });

  }

  getUserId(): string | null {
    return this.currentUser?.uid ?? null;
  }

  async waitForUser(): Promise<User> {
    return this.authReadyPromise;
  }

  async getUserIdAsync(): Promise<string> {
    const user = await this.waitForUser();
    return user.uid;
  }
}
