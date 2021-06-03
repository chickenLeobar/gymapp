import { ZoneOutside } from '@delon/util';
import { FormControl } from '@angular/forms';
import { ERol } from './../../../../services/rol.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { IUserView1 } from './../../../../@core/models/User';
import { UserService } from './../../services/user.service';
import { ChatuiService } from './../../../../@core/modules/chat/services/chatui.service';
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  ViewChild,
  TemplateRef,
  ChangeDetectorRef,
  DoCheck,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
@Component({
  selector: 'app-user-modal',
  templateUrl: './user-modal.component.html',
  styleUrls: ['./user-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
@UntilDestroy()
export class UserModalComponent implements OnInit, OnChanges {
  public state = new FormControl();
  public loadingSwitch = false;
  private _user: IUserView1;
  public changues = false;
  public referralCredits: number;
  @Input() set user(v: IUserView1) {
    v.referrealCredits;
    this.creditRequest = {
      idCredit: v.id_credit,
      credits: v.credits
    };
    this.referralCredits = v.referrealCredits;
    this.state.setValue(!v.suspended);
    this._user = v;
  }

  get user() {
    return this._user;
  }
  creditRequest: {
    credits: number;
    reason?: string;
    idCredit: string;
  };

  @ViewChild('creditstpl', { read: TemplateRef })
  creditsTpl: TemplateRef<NzSafeAny>;

  constructor(
    private modalService: NzModalService,
    private chatService: ChatuiService,
    private userReportService: UserService,
    private nzMessageService: NzMessageService,
    private changueDetection: ChangeDetectorRef
  ) {}
  ngOnChanges(changes: SimpleChanges): void {}

  ngOnInit(): void {
    // this.listenChangueState();
  }
  changueReferrealCredits() {
    // this.updateReferrealCredits();
    this.user = {
      ...this.user,
      referrealCredits: this.referralCredits
    };
    this.changues = true;
  }
  saveChangues() {
    this.updateReferrealCredits();
  }
  updateReferrealCredits() {
    this.userReportService
      .updateReferrealCredits({
        credits: this.referralCredits,
        idCredit: this.user.id_credit
      })
      .toPromise()
      .then((_) => {
        this.changues = false;
        this.nzMessageService.success('Cambios aplicados');
        this.changueDetection.markForCheck();
      });
  }

  chagueState($event) {
    const val = this.state.value as boolean;
    this.loadingSwitch = true;
    if (val == false) {
      this.updateStateUser(!val);
    } else {
      this.modalService.confirm({
        nzZIndex: 1000,
        nzMask: true,
        nzTitle: '¿Esta seguro que desea suspender esta cuenta?',
        nzContent:
          'El usuario no tendra acceso a su cuenta hasta que le vuelva a reactivar',
        nzOnOk: () => {
          this.updateStateUser(!val);
        },
        nzOnCancel: () => {
          this.loadingSwitch = false;
          this.changueDetection.markForCheck();
        }
      });
    }
  }
  private updateStateUser(val: boolean) {
    this.userReportService
      .updateState({
        idUser: this.user.id,
        state: !val
      })
      .toPromise()
      .then((_) => {
        this.loadingSwitch = false;
        this.nzMessageService.success('Estado actualizado');
        this.userReportService.refreshQuierUsers();
        this.state.setValue(val);
        this.changueDetection.markForCheck();
      });
  }

  showModalCredits() {
    const ref = this.modalService.create({
      nzContent: this.creditsTpl,
      nzTitle: 'Aumentar o disminuir creditos',
      nzOnOk: () => {
        const credits = this.creditRequest.credits - this.user.credits;
        if (this.creditRequest?.reason) {
          this.userReportService
            .addManualCredits({
              ...this.creditRequest,
              credits: credits
            })
            .pipe(untilDestroyed(this))
            .subscribe((credits: number) => {
              this.nzMessageService.success('Se aplicaron los creditos');
              this.user = {
                ...this.user,
                credits: credits
              };
              this.userReportService.refreshQuierUsers();
              this.changueDetection.markForCheck();
              ref.destroy();
            });
        } else {
          this.modalService.error({
            nzTitle: 'Campo requerido',
            nzContent:
              'Es necesario explicar la razón del moviemiento de los creditos'
          });
        }
      }
    });
  }
  public handleRoles(roles: ERol[]) {
    this.userReportService
      .updateRoles({ idUser: this.user.id, roles: roles })
      .pipe(untilDestroyed(this))
      .subscribe((_) => {
        this.nzMessageService.success('Rol actualizado');
        this.userReportService.refreshQuierUsers();
      });
  }
  public openChat() {
    this.chatService.openChatWithUser(this.user.id);
  }
}
