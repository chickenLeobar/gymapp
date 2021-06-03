import { MyCustomValidators } from './../../helpers/Validators';
import { take } from 'rxjs/operators';
import {
  FormBuilder,
  FormControl,
  Validators,
  FormGroup,
} from '@angular/forms';
import { AuthService } from './../services/auth.service';
import { Component, Inject, OnInit } from '@angular/core';
import { CONFIGAUTH, IconfigAuth } from './../config';
import { ModalOptions, NzModalService } from 'ng-zorro-antd/modal';
import { ActivatedRoute, Params } from '@angular/router';
import { interval } from 'rxjs';
@Component({
  selector: 'app-changuepassword',
  templateUrl: './changuepassword.component.html',
  styleUrls: ['../auth.styles.scss'],
})
export class ChanguepasswordComponent implements OnInit {
  public stylesForBackground = {
    backgroundImage: `url('${this.configAuth.imageForRegister}')`,
    backgroundPosition: 'center',
    backgroundSize: 'cover',
  } as CSSStyleDeclaration;
  public stepEmail = true;
  public email: FormControl;
  public counter = this.configAuth.timePrevent;
  public loading: boolean = false;
  public disabled = false;
  public attempsSend = 0;
  private recolectSubs = [];
  public passwordForm: FormGroup;
  private token: string;
  constructor(
    @Inject(CONFIGAUTH) public configAuth: IconfigAuth,
    private authService: AuthService,
    private fb: FormBuilder,
    private modalService: NzModalService,
    private activateRouter: ActivatedRoute
  ) {}

  private changueState(): void {
    this.disabled = true;
    const subInterval = interval(1000)
      .pipe(take(this.configAuth.timePrevent))
      .subscribe({
        next: (time) => (this.counter = this.counter - 1),
        complete: () => {
          this.disabled = false;
          this.counter = this.configAuth.timePrevent;
          subInterval.unsubscribe();
        },
      });
  }

  public forgotPassword(): void {
    const email = this.email.value;
    if (this.email.valid) {
      this.loading = true;
      this.changueState();
      this.attempsSend += 1;
      const subforgotPassword = this.authService
        .forgotPassword(email)
        .subscribe(
          ({ resp }: { resp: boolean }) => {
            if (resp) {
              this.modalService.success({
                nzTitle: 'Exito',
                nzContent: `Hemos Enviado un email a ${this.email.value}`,
              } as ModalOptions);
            } else {
              this.modalService.error({
                nzContent: `${this.email.value} no esta vinculado a  una cuenta Wellness Pro`,
              } as ModalOptions);
            }
          },
          () => {},
          () => {
            this.loading = false;
          }
        );

      this.recolectSubs.push(subforgotPassword);
    }
  }
  public changuePassword() {
    if (this.passwordForm.valid) {
      const valuePassword = this.passwordForm.value.password;
      const reactionOnToken = (resp: boolean) => {
        if (!resp) {
          this.modalService.error({
            nzTitle: 'Solicitud vencida',
            nzContent:
              'Al parecer esta solicitud ha vencido, por favor revise sus correos mas recientes o solicite un nuevo cambio de contraseña',
          });
        }
      };
      this.authService
        .changuePassword(valuePassword, this.token)
        .subscribe(reactionOnToken);
    }
  }

  private listenRoutes() {
    this.activateRouter.queryParams.subscribe((params: Params) => {
      if ('forgotpassword' in params) {
        this.stepEmail = false;
        this.token = params['forgotpassword'];
        console.log(this.token);
      }
    });
  }
  ngOnInit(): void {
    this.listenRoutes();
    this.email = this.fb.control(null, [Validators.required, Validators.email]);
    this.passwordForm = this.fb.group({
      password: this.fb.control(null, [
        MyCustomValidators.verifyPassword(),
        Validators.min(9),
      ]),
      repeatPassword: this.fb.control(null, [
        MyCustomValidators.identStrings.call(
          this,
          ['password', 'repeatPassword'],
          'passwordForm'
        ),
      ]),
    });
  }
}
