import { NzMessageService } from 'ng-zorro-antd/message';
import { ChatuiService } from './../../../@core/modules/chat/services/chatui.service';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { IRequestCredit } from './../../../@core/models/requestCredits';
import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { CreditsreportService } from '../services/creditsreport.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-request-credits',
  templateUrl: './request-credits.component.html',
  styleUrls: ['./request-credits.component.scss']
})
@UntilDestroy()
export class RequestCreditsComponent implements OnInit {
  requestCredits: IRequestCredit[] = [];
  @ViewChild('modalCredits', { read: TemplateRef })
  tplModalCredits: TemplateRef<NzSafeAny>;

  selectRequest: IRequestCredit;

  public creditsRequest: number;

  constructor(
    private creditService: CreditsreportService,
    private modalService: NzModalService,
    private chatService: ChatuiService,
    private nzMessageService: NzMessageService
  ) {
    this.creditService
      .getRequestforAttend()
      .pipe(untilDestroyed(this))
      .subscribe((data) => (this.requestCredits = data));
  }

  openChatWithUser() {
    if (this.selectRequest)
      this.chatService.openChatWithUser(this.selectRequest.idUser);
  }
  private aproveCredits() {
    this.creditService
      .aprovedCredits({
        idRequest: this.selectRequest.id_request,
        credits: this.creditsRequest
      })
      .toPromise()
      .then((_) => {
        this.creditsRequest = null;
        this.selectRequest = null;
        this.nzMessageService.success('Se aplicaron los cambios');
        this.creditService.refreshRequests();
      });
  }

  get isAproved() {
    return this.selectRequest?.state == 'APPROVED' || false;
  }

  openModal() {
    this.selectRequest = this.requestCredits[0];
    this.creditsRequest = this.selectRequest.credits;
    this.modalService.create({
      nzContent: this.tplModalCredits,
      nzOkText: 'Aprobar',
      nzOnOk: () => {
        this.aproveCredits();
      }
    });
  }
  ngOnInit(): void {}
}
