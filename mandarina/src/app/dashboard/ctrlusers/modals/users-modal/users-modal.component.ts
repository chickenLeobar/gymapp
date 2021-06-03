import { NzMessageService } from 'ng-zorro-antd/message';
import { UserService } from './../../services/user.service';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef,
  AfterViewInit,
  Inject
} from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-users-modal',
  templateUrl: './users-modal.component.html',
  styleUrls: ['./users-modal.component.scss']
})
export class UsersModalComponent implements OnInit, AfterViewInit {
  @ViewChild('modalCredits', { read: TemplateRef })
  tplCreditsModal: TemplateRef<NzSafeAny>;

  userIds: number[] = [];
  formCredits: FormGroup;

  constructor(
    private modal: NzModalService,
    private fb: FormBuilder,
    private userService: UserService,
    private nzMessage: NzMessageService,
    @Inject(MAT_DIALOG_DATA) { ids }: { ids: number[] }
  ) {
    this.userIds = ids;
  }
  ngAfterViewInit(): void {}

  ngOnInit(): void {
    this.buildForms();
  }

  buildForms() {
    this.formCredits = this.fb.group({
      credits: [0],
      reason: ['', Validators.required]
    });
  }
  private operationMultipleCredits() {
    // operation credits
    if (this.formCredits.valid) {
      const value = this.formCredits.value as {
        credits: number;
        reason: string;
      };
      this.userService
        .aplicateCreditUsers({
          reason: value.reason,
          credits: value.credits,
          ids: this.userIds
        })
        .toPromise()
        .then((resp) => {
          this.nzMessage.success('Se aplicaron los cambios');
          this.userService.refreshQuierUsers();
        });
    }
  }
  openModalCredits() {
    this.modal.create({
      nzContent: this.tplCreditsModal,
      nzZIndex: 50,
      nzOnOk: () => {
        this.operationMultipleCredits();
      }
    });
  }
}
