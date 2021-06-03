import {
  Component,
  OnInit,
  OnChanges,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { Inject, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit, OnDestroy {
  ngOnDestroy(): void {}
  ngOnInit(): void {}
}
