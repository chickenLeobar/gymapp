import { PROFILECONFIG, ProfileConfig } from '../../config';
import { ProfileService } from '../../services/profile.service';
import { IUser } from '@core/models/User';
import {
  Component,
  OnInit,
  OnChanges,
  SimpleChanges,
  ViewEncapsulation
} from '@angular/core';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { Inject, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['../../profile.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class ProfileComponent implements OnInit, OnChanges, OnDestroy {
  public user: IUser;
  subscriptions: Subscription[] = [];
  dateBirth: Date;
  edit = false;
  constructor(
    private profileService: ProfileService,
    @Inject(PROFILECONFIG) public defaultConfig: ProfileConfig
  ) {}
  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => {
      if (sub) {
        sub.unsubscribe();
      }
    });
  }
  ngOnChanges(changes: SimpleChanges): void {}
  ngOnInit(): void {
    // test id
    this.getUserDefault();
  }

  private getUserDefault() {
    const getUserSUB = this.profileService
      .getUser()
      .subscribe(({ data, loading }) => {
        if (data.getUser.resp) {
          this.user = Object.assign({}, data.getUser.user);
          if (!this.user.description) {
            this.user = {
              ...this.user,
              description: this.defaultConfig.defaultDescription,
              birth: this.user?.birth || new Date()
            };
          }
        }
      });
    this.subscriptions.push(getUserSUB);
  }

  public handleChange(info: { file: NzUploadFile }): void {
    // console.log(info.file.status);
  }
  actionServer = (info: any) => {
    const sub = this.profileService
      .uploadFile(info.file, this.user.id)
      .subscribe(({ data, errors }) => {
        if (data.addProfilePicture.resp) {
          this.user = {
            ...this.user,
            image: data.addProfilePicture.path
          };
        }
      });

    return sub;
  };
  public editProfile(): void {
    this.edit = !this.edit;
    if (!this.edit) {
      const subEditUser = this.profileService
        .editUser(this.user.id, this.user)
        .subscribe((res) => {
          this.user = res.data.editUser.user;
        });
      this.subscriptions.push(subEditUser);
    }
  }
  public changeBirth($event: Date) {
    this.user = {
      ...this.user,
      birth: $event
    };
  }
}
