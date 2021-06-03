import { tap, map, concatAll } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { from, Observable } from 'rxjs';
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpRequest,
} from '@angular/common/http';
type ResposeStorageUrl = {
  resp: boolean;
  url: string;
  source: {
    bucket: string;
    key: string;
  };
};
@Injectable()
export class StorageService {
  constructor(private http: HttpClient) {}
  getPresignedUrl(filename: string, fileType: string) {
    const headers = new HttpHeaders().set('Accept', 'application/json');
    const queryParams = new HttpParams()
      .set('filename', filename)
      .set('filetype', fileType);
    return this.http
      .get<ResposeStorageUrl>(`${environment.apiUrl}/amazon/url`, {
        headers: headers,
        params: queryParams,
      })
      .toPromise();
  }

  uploadFileAws3(file: File): Observable<any> {
    // function for execute async process
    const ctrl = async () => {
      const soourceUpload = await this.getPresignedUrl(file.name, file.type);

      let headers = new HttpHeaders()
        .set('Content-Type', file.type)
        .set('x-amz-acl', 'public-read');
      const request = new HttpRequest('PUT', soourceUpload.url, file, {
        headers: headers,
        reportProgress: true,
      });
      return this.http.request(request).pipe(
        map((resp: { type: number; loaded: number; total: number }) => {
          const res = Math.floor((resp.loaded / resp.total) * 100);
          return {
            percent: res,
            resp: { ...soourceUpload.source, type: file.type },
          };
        })
      );
    };
    return from(ctrl()).pipe(concatAll());
  }
}
