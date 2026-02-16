import { ErrorHandler, Injectable, inject } from '@angular/core';
import { ErrorStore } from './error.store';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private errors = inject(ErrorStore);

  handleError(error: any): void {
    const message = (error?.message ?? error?.toString?.() ?? 'Unknown error');
    alert(`Global error captured: ${message}`); // Alert para visibilidad inmediata
    const stack = error?.stack;

    this.errors.push({
      kind: 'error',
      message,
      stack,
      extra: error,
    });

    // still log for desktop debugging
    // eslint-disable-next-line no-console
    console.error(error);
  }
}