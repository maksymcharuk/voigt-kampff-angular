import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'host',
  },
  {
    path: 'host',
    loadComponent: () => import('./pages/host/host.component').then((m) => m.HostComponent),
  },
  {
    path: 'join/:sessionId',
    loadComponent: () => import('./pages/join/join.component').then((m) => m.JoinComponent),
  },
  {
    path: 'play/:sessionId',
    loadComponent: () => import('./pages/play/play.component').then((m) => m.PlayComponent),
  },
  {
    path: 'result/:sessionId',
    loadComponent: () => import('./pages/result/result.component').then((m) => m.ResultComponent),
  },
  {
    path: '**',
    redirectTo: 'host',
  },
];
