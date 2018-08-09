import { ErrorHandler } from '@angular/core';
import { isDevMode } from '@angular/core';

import * as Raven from 'raven-js';

Raven
  .config('https://ed72ed41f0fd4345a4f5b4168e827a25@sentry.io/1259370')
  .install();

export class RavenErrorHandler implements ErrorHandler {
  handleError(err: any): void {
    Raven.captureException(err);
  }
}

export function provideErrorHandler() {
  if (!isDevMode()) {
    return new RavenErrorHandler();
  } else {
    return new ErrorHandler();
  }
}
