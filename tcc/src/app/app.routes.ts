import { Routes } from '@angular/router';
import { authGuard } from './core/guards';

export const routes: Routes = [
  {
    path: 'auth',
    loadComponent: () => import('./features/auth/auth.page').then(m => m.AuthPage),
  },
  {
    path: '',
    canActivate: [authGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'today' },
      {
        path: 'today',
        loadComponent: () => import('./features/today/today.page').then(m => m.TodayPage),
      },
      {
        path: 'log',
        loadComponent: () => import('./features/log/log.page').then(m => m.LogPage),
      },
      {
        path: 'exposure/:actionId',
        loadComponent: () => import('./features/exposure/exposure.page').then(m => m.ExposurePage),
      },
      {
        path: 'review',
        loadComponent: () => import('./features/review/review.page').then(m => m.ReviewPage),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];