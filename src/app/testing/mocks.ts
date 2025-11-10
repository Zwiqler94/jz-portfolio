import { Injectable } from '@angular/core';

/**
 * Lightweight mock implementations shared across spec files to avoid pulling
 * in the real Firebase-backed services during unit tests.
 */
@Injectable()
export class MockAuthService {
  uid?: string;
  userToken?: string;
  appCheckToken?: string;
  isLoggedIn = false;

  // Tests can spyOn this method if they need to assert calls.
  async getAppCheckToken(_: string) {
    return { token: 'mock-app-check-token' };
  }

  logout(): void {
    /* noop */
  }
}
