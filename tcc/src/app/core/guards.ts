import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SessionStore } from './session.store';

export const authGuard: CanActivateFn = async () => {
  const session = inject(SessionStore);
  const router = inject(Router);

  await session.init();
  if (!session.isAuthenticated()) {
    router.navigateByUrl('/auth');
    return false;
  }
  // bootstrap account para que el resto no pregunte
  if (!session.accountId()) {
    await session.bootstrapAccount();
  }
  return true;
};