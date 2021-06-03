import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CloudinaryService as FileService } from './services/file.service';

import * as cloudinary from 'cloudinary-core';

import { CloudinaryModule as cloudModule } from '@cloudinary/angular-5.x';
import { CloudinaryUplodComponent } from './components/cloudinary-uplod.component';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { HttpClientModule } from '@angular/common/http';
import { NzCardModule } from 'ng-zorro-antd/card';
export const configCloud = {
  cloud_name: 'wellnesspro',
  upload_preset: 'ml_default',
};
@NgModule({
  declarations: [CloudinaryUplodComponent],
  providers: [FileService],
  imports: [
    HttpClientModule,
    NzButtonModule,
    CommonModule,
    NzUploadModule,
    NzCardModule,
    cloudModule.forRoot(cloudinary, configCloud),
  ],
  exports: [CloudinaryUplodComponent],
})
export class CloudinaryModule {}
