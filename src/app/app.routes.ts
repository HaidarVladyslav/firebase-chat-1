import { Routes } from '@angular/router';
import { isAuthenticatedGuard } from './shared/guards/auth.guard';

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./auth/login/login.component') },
  { path: 'register', loadComponent: () => import('./auth/register/register.component') },
  {
    path: 'chat',
    canActivate: [isAuthenticatedGuard()],
    loadComponent: () => import('./chat/chat.component')
  },
  { path: '', redirectTo: 'chat', pathMatch: 'full' }
];
