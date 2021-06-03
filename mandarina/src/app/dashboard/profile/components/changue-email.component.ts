import { IUser } from './../../../@core/models/User';
import { Component, OnInit, Input } from '@angular/core';
import { EmailService } from './emailService.service';
import { FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-changue-email',
  template: `
    <p>
      <b>Su email no esta confirmado</b>: Enviamos un correo a
      <b>{{ user.email }}</b>
    </p>

    <div>
      <nz-form-item *ngIf="isEmailAction == 'show'" class="d-block w-50">
        <nz-form-control [nzErrorTip]="'Email Invalido'">
          <label class="subtitle py-1 d-block" for="email">
            Ingrese su email
          </label>
          <input
            type="email"
            [formControl]="email"
            placeholder="Email"
            id="email"
            nz-input
          />
        </nz-form-control>
        <!-- <button nz-button class="my-2" nzType="primary">Cambiar email</button> -->
      </nz-form-item>
      <nz-divider nzType="horizontal"></nz-divider>
      <button
        nz-button
        [nzLoading]="loadingUrlemail"
        (click)="sendConfirmationUrl()"
      >
        Reenviar email
      </button>
      <nz-divider nzType="vertical"></nz-divider>
      <button
        nz-button
        [nzLoading]="loadingChangueEmail"
        (click)="actionEmail()"
      >
        Cambiar Email
      </button>
    </div>
  `,
  styles: [],
  providers: [EmailService],
})
export class ChangueEmailComponent implements OnInit {
  isEmailAction: 'show' | 'sendemail' | 'none' = 'none';
  @Input('user') user: IUser;
  loadingUrlemail = false;
  loadingChangueEmail = false;
  email: FormControl;
  constructor(private emailService: EmailService, private fb: FormBuilder) {}
  ngOnInit(): void {
    this.email = this.fb.control(null, [Validators.email, Validators.required]);
  }
  sendConfirmationUrl() {
    this.loadingUrlemail = true;
    this.emailService.sendConfirmationUrl(this.user.email).subscribe({
      next: () => {
        this.loadingUrlemail = false;
      },
    });
  }
  actionEmail() {
    switch (this.isEmailAction) {
      case 'none': {
        this.isEmailAction = 'show';
        break;
      }
      case 'show': {
        if (this.email.valid) {
          if (this.email.value === this.user.email) {
            console.log('equal email');
          } else {
            this.loadingChangueEmail = true;
            this.emailService
              .changueEmail(this.email.value, Number(this.user.id))
              .subscribe();
          }
        }
      }
    }
  }
}
