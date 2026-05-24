import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),

    provideFirebaseApp(() => initializeApp({
      projectId: "bilbao-guide",
      appId: "1:1087519235600:web:ca5ea4792afdba57d67495",
      storageBucket: "bilbao-guide.firebasestorage.app",
      apiKey: "AIzaSyB3UNHz5v1BjgnQMMi93jE8JznW0cfshkI",
      authDomain: "bilbao-guide.firebaseapp.com",
      messagingSenderId: "1087519235600"
    })),

    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage())
  ]
};
