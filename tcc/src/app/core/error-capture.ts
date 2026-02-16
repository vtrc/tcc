import { ErrorStore } from './error.store';

export function installGlobalErrorCapture(errors: ErrorStore) {
  window.addEventListener('error', (ev) => {
    errors.push({
      kind: 'error',
      message: ev.message || 'window.error',
      stack: (ev.error && ev.error.stack) ? ev.error.stack : undefined,
      extra: {
        filename: ev.filename,
        lineno: ev.lineno,
        colno: ev.colno,
      },
    });
  });

  window.addEventListener('unhandledrejection', (ev: PromiseRejectionEvent) => {
    const reason: any = ev.reason;
    errors.push({
      kind: 'error',
      message: reason?.message ?? String(reason ?? 'unhandledrejection'),
      stack: reason?.stack,
      extra: reason,
    });
  });

  // Opcional: interceptar console.error/warn para que también salgan
  const origErr = console.error;
  console.error = (...args: any[]) => {
    try {
      errors.push({
        kind: 'error',
        message: args.map(a => typeof a === 'string' ? a : JSON.stringify(a)).join(' '),
        extra: args,
      });
    } catch {}
    origErr(...args);
  };

  const origWarn = console.warn;
  console.warn = (...args: any[]) => {
    try {
      errors.push({
        kind: 'warn',
        message: args.map(a => typeof a === 'string' ? a : JSON.stringify(a)).join(' '),
        extra: args,
      });
    } catch {}
    origWarn(...args);
  };
}