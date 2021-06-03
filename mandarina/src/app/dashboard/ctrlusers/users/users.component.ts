import { IUserView1 } from './../../../@core/models/User';
import { UserService } from './../services/user.service';
import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { UsersModalComponent } from '../modals/users-modal/users-modal.component';
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
@UntilDestroy()
export class UsersComponent implements OnInit {
  checkedAll = false;
  indeterminate = false;
  idsSelect = new Set<number>();
  hideButtonOperations = false;
  public users: IUserView1[] = [];

  @ViewChild('modal', { static: true, read: TemplateRef })
  modal: TemplateRef<NzSafeAny>;
  constructor(private userService: UserService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.userService.init();
    this.userService.$userAllObs
      .pipe(untilDestroyed(this))
      .subscribe((users) => (this.users = users));
    // this.opendModalMultipleUsers();
  }

  /*=============================================
 =            table methods            =
 =============================================*/
  refreshCheckedStatus() {
    this.checkedAll = this.users.every(({ id }) => this.idsSelect.has(id));
    this.indeterminate =
      this.users.some(({ id }) => this.idsSelect.has(id)) && !this.checkedAll;

    if (this.indeterminate || this.checkedAll) {
      this.hideButtonOperations = true;
    } else {
      this.hideButtonOperations = false;
    }
  }

  onAllChecked(checked: boolean) {
    this.users.forEach(({ id }) => this.updateChecked(id, checked));
    this.refreshCheckedStatus();
  }
  private updateChecked(id: number, checked: boolean) {
    if (checked) {
      this.idsSelect.add(id);
    } else {
      this.idsSelect.delete(id);
    }
  }
  singleChecked(id: number, checked: boolean) {
    this.updateChecked(id, checked);
    this.refreshCheckedStatus();
  }

  openModalOnlyUser(user: IUserView1) {
    this.dialog.open(this.modal, {
      data: {
        user
      }
    });
  }

  opendModalMultipleUsers() {
    this.dialog.open(UsersModalComponent, {
      data: { ids: Array.from(this.idsSelect) }
    });
  }
}
