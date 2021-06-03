import { tap, catchError, pluck } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Cloudinary } from '@cloudinary/angular-5.x';
import { environment } from 'src/environments/environment';

@Injectable()
export class CloudinaryService {
  constructor(private http: HttpClient, private cloudinary: Cloudinary) {}
  uploadFileCloudinary(
    file: File,
    auth: { timestamp: number; signature: string }
  ) {
    const formData = new FormData();
    const url = `https://api.cloudinary.com/v1_1/${
      this.cloudinary.config().cloud_name
    }/upload`;
    formData.append('file', file);
    formData.append('api_key', environment.apiKeyCloudinary);
    formData.append('timestamp', String(auth.timestamp));
    formData.append('upload_preset', this.cloudinary.config().upload_preset);
    formData.append('signature', auth.signature);
    const headers = new HttpHeaders().set('X-Requested-With', 'XMLHttpRequest');
    return this.http
      .post(url, formData, { headers })
      .pipe(
        catchError((err) => {
          return of(err);
        })
      )
      .toPromise();
  }

  getSignature(): Promise<{ signature: string; timestamp: number }> {
    return this.http
      .get<{ signature: string; timestamp: number }>(
        `${environment.apiUrl}/media/signature`
      )
      .toPromise();
  }
}
