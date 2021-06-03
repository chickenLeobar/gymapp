import { Router, Params } from '@angular/router';
import { SocialUser } from 'angularx-social-login';
import { Subscription, Subject } from 'rxjs';
import { IUser } from './../../@core/models/User';
import { AuthService } from './../services/auth.service';
import { MyCustomValidators } from './../../helpers/Validators';
import { CONFIGAUTH, IconfigAuth } from './../config';
import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import _ from 'lodash';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['../auth.styles.scss'],
})
export class RegisterComponent implements OnInit, OnDestroy {
  public registerForm: FormGroup;
  user: IUser;
  public sponsor: string = '';
  stylesForBackground = {
    backgroundImage: `url('${this.configAuth.imageForRegister}')`,
    backgroundPosition: 'center',
    backgroundSize: 'cover',
  } as CSSStyleDeclaration;
  subscriptionProvider: Subscription;
  private eventSignUp = new Subject<string>();
  private recolectSubs = [];
  constructor(
    private fb: FormBuilder,
    private _AUHtSERVICE: AuthService,
    @Inject(CONFIGAUTH) public configAuth: IconfigAuth,
    private modalZorro: NzModalService,
    private router: Router,
    private activateRoute: ActivatedRoute
  ) {}

  /*=============================================
  =            LIFECYCLE            =
  =============================================*/
  ngOnInit(): void {
    this.buildForm();
    this.configureProvider();
    this.listens();
  }

  private configureProvider() {
    this.subscriptionProvider = this.eventSignUp.subscribe((provider) => {
      this.user = { ...this.user, sponsor: this.sponsor };

      this._AUHtSERVICE.signUp(this.user, provider).subscribe((data) => {
        if (data.resp) {
          this._AUHtSERVICE.saveToken(data.token);
          this.router.navigateByUrl('/dashboard');
        } else {
          this.modalZorro.error({
            nzTitle: 'ERROR',
            nzContent: data.errors.shift().message,
            nzOkText: 'De acuerdo',
          });
        }
      });
    });
  }
  ngOnDestroy(): void {
    this.subscriptionProvider.unsubscribe();
  }

  /*=============================================
 =            listens            =
 =============================================*/

  private listens(): void {
    this.activateRoute.queryParams.subscribe((params: Params) => {
      this.sponsor = params.sponsor;
    });
  }

  private buildForm(): void {
    this.registerForm = this.fb.group({
      name: this.fb.control(null, [Validators.required]),
      lastName: this.fb.control(null, [Validators.required]),
      email: this.fb.control(null, [Validators.email]),
      password: this.fb.control(null, [
        MyCustomValidators.verifyPassword(),
        Validators.min(9),
      ]),
      repeatPassword: this.fb.control(null, [
        Validators.required,
        MyCustomValidators.identStrings.call(
          this,
          ['password', 'repeatPassword'],
          'registerForm'
        ),
      ]),
      phone: this.fb.control(null, [Validators.required]),
    });
    if (!this.existSponsor) {
      this.registerForm.addControl(
        'sponsor',
        this.fb.control(null, [Validators.required])
      );
    }
  }
  get existSponsor() {
    return this.sponsor && this.sponsor.length >= 0;
  }

  eventOfProvider($event: SocialUser) {
    if (!$event.email) {
      this.modalZorro.error({
        nzTitle: 'Error',
        nzContent:
          'No puede registrarse con este proveedor por que no contiene un email',
        nzFooter: 'NOTA: puede registrarse con google',
        nzOkText: 'De acuerdo',
      });
      return;
    }
    this.user = {
      email: $event.email,
      name: $event.firstName,
      lastName: $event.lastName,
    };
    this.eventSignUp.next($event.provider.toLowerCase());
  }
  senForm(): void {
    if (this.registerForm.valid) {
      const value = this.registerForm.value as IUser;
      this.sponsor = value.sponsor;

      this.user = _.omit(value, ['repeatPassword']);
      this.eventSignUp.next('email');
    } else {
    }
  }
}
