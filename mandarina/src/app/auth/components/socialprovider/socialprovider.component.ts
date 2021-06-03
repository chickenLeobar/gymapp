import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  OnDestroy,
  Input,
} from '@angular/core';
import { AuthProviders } from '../../services/authproviders.service';
import { SocialAuthService, SocialUser } from 'angularx-social-login';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-socialprovider',
  template: `
    <div class="contain_social_method">
      <h3 class="">{{ this.text }}</h3>
      <div class="icons">
        <a (click)="autService.signInWithFB()">
          <i class="fab fa-facebook-f"></i>
        </a>
        <a (click)="autService.signInWithGoogle()">
          <i class="fab fa-google"></i>
        </a>
      </div>
    </div>
  `,
  styleUrls: ['../../auth.styles.scss'],
})
export class SocialproviderComponent implements OnInit, OnDestroy {
  user: SocialUser;
  usbAutProvider: Subscription;
  @Input('text') text = 'Ingresa con una red social:';
  @Output() userEmit = new EventEmitter<SocialUser>();

  constructor(
    public autService: AuthProviders,
    private socialAuthService: SocialAuthService
  ) {
    // console.log('load component')
  }
  ngOnDestroy(): void {
    this.usbAutProvider.unsubscribe();
  }

  ngOnInit(): void {
    this.usbAutProvider = this.socialAuthService.authState.subscribe((user) => {
      this.user = user;
      this.userEmit.emit(this.user);
    });
  }
}
