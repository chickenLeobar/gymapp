import { MyCustomValidators } from './../../helpers/Validators';
import { AuthService } from './../services/auth.service';
import { CONFIGAUTH, IconfigAuth } from './../config';
import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { SocialUser } from 'angularx-social-login';
import { NzModalService } from 'ng-zorro-antd/modal';
interface ILoguin {
  email: string;
  password?: string;
}
import { Subject } from 'rxjs';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../auth.styles.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  formLogin: FormGroup;
  subscriptionProvider: Subscription;
  stylesForBackground = {
    backgroundImage: `url('${this.configAuth.imageForLogin}')`,
    backgroundPosition: 'center',
    backgroundSize: 'cover',
  } as CSSStyleDeclaration;
  loguinData: ILoguin;
  private eventSignIn = new Subject<string>();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    @Inject(CONFIGAUTH) public configAuth: IconfigAuth,
    private _AUTHSERVICE: AuthService,
    private modalZorro: NzModalService
  ) {}
  ngOnDestroy(): void {
    this.subscriptionProvider.unsubscribe();
  }

  ngOnInit(): void {
    this.buildForm();
    this.subscriptionProvider = this.eventSignIn.subscribe(
      (provider: string) => {
        this._AUTHSERVICE
          .sigIn(this.loguinData.email, this.loguinData.password, provider)
          .pipe(take(1))
          .subscribe((data) => {
            if (data.resp) {
              this._AUTHSERVICE.saveToken(data.token);
              this.router.navigateByUrl('/dashboard');
            } else {
              this.modalZorro.error({
                nzTitle: 'ERROR',
                nzContent: data.errors.shift().message,
                nzOkText: 'De acuerdo',
              });
            }
          });
      }
    );
  }
  buildForm(): void {
    this.formLogin = this.fb.group({
      email: this.fb.control(null, [Validators.email]),
      password: this.fb.control(null, [
        Validators.min(9),
        MyCustomValidators.verifyPassword(),
      ]),
    });
  }
  public submitForm(): void {
    if (this.formLogin.valid) {
      this.loguinData = this.formLogin.value as ILoguin;
      this.eventSignIn.next('email');
    }
  }

  public withSocialProvider(user: SocialUser): void {
    if (user)
      this.loguinData = {
        email: user.email,
      };
    this.eventSignIn.next(user.provider.toLowerCase());
  }
}
