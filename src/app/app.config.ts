import { ApplicationConfig, InjectionToken } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

import { routes } from './app.routes';
import { environment } from '../environments/environment';

const app = initializeApp(environment.firebaseConfig);

export const AUTH = new InjectionToken('Firebase auth', {
  providedIn: 'root',
  factory: () => {
    const auth = getAuth();
    return auth;
  }
});

export const FIRESTORE = new InjectionToken('Firebase firestore', {
  providedIn: 'root',
  factory: () => {
    let firestore = getFirestore();
    return firestore;
  }
});

export const FIREBASE_STORAGE = new InjectionToken('firebase storage', {
  providedIn: 'root',
  factory: () => {
    let storage = getStorage();
    return storage;
  }
})

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideAnimations()]
};
