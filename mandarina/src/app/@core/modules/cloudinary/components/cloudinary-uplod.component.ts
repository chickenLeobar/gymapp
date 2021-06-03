import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CloudinaryService } from '../services/file.service';
@Component({
  selector: 'app-video-uplod',
  template: `
    <nz-upload
      nzAction="null"
      [nzFileListRender]="list"
      nzAccept="video/mp4,video/x-m4v,video/*"
      [nzBeforeUpload]="nzBeforeUpload"
      nzListType="text"
    >
      <button nz-button>
        <i nz-icon nzType="upload"></i>seleccionar video
      </button>
    </nz-upload>
    <ng-template #list> </ng-template>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CloudinaryUplodComponent implements OnInit {
  @Output() fileEmitter = new EventEmitter<File>();
  constructor(private serviceUpload: CloudinaryService) {}
  nzBeforeUpload = (data: any) => {
    this.fileEmitter.emit(data);
    return false;
  };
  ngOnInit(): void {}
}
