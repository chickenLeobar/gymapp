import { NgModule } from '@angular/core';
import {
  SocialLoginModule,
  SocialAuthServiceConfig,
} from 'angularx-social-login';
// providers
import {
  FacebookLoginProvider,
  GoogleLoginProvider,
} from 'angularx-social-login';
import { environment } from 'src/environments/environment';
import { AuthProviders } from './services/authproviders.service';
@NgModule({
  declarations: [],
  imports: [SocialLoginModule],
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(environment.googleClientId),
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider(environment.fabookClienId),
          },
        ],
      } as SocialAuthServiceConfig,
    },
    AuthProviders,
  ],
})
export class SocialprovidersModule {}
