import { Injectable } from '@angular/core';
import {
  FacebookLoginProvider,
  GoogleLoginProvider,
  SocialAuthService,
} from 'angularx-social-login';

@Injectable()
export class AuthProviders {
  constructor(private authService: SocialAuthService) {}

  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  signInWithFB(): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

  signOut(): void {
    this.authService.signOut();
  }
}
