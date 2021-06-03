import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { VimeoUploadVideo } from './models';
/**
 *
 * links
 * issue  with tust : https://github.com/tus/tus-js-client/issues/219
 * tust library :  https://github.com/tus/tus-js-client
 */

import { environment } from 'src/environments/environment';

import * as tus from 'tus-js-client';

@Injectable()
export class VimeoService {
  constructor(private http: HttpClient) {}
  /**
   * @param file :  backend use this file for generate url upload
   * @returns : link :
   */
  async getVimeoAccess(
    file: File
  ): Promise<{ linkUpload: string; video: string }> {
    return await this.http
      .post<{ linkUpload: string; video: string }>(
        `${environment.apiUrl}/vimeo/token`,
        {
          name: file.name,
          size: file.size,
        }
      )
      .toPromise();
  }

  uploadVideo(file: File): Observable<VimeoUploadVideo> {
    const obs = new Observable<VimeoUploadVideo>((sub) => {
      (async () => {
        // el toke deberia tener alguna relacion con el localStorage
        const vimeAcces = await this.getVimeoAccess(file).catch((err) => {
          sub.error(err);
          return null;
        });
        sub.next({ ...vimeAcces });
        const upload = new tus.Upload(file, {
          endpoint: vimeAcces.linkUpload,
          uploadUrl: vimeAcces.linkUpload,
          retryDelays: [0, 1000, 3000, 5000],
          metadata: {
            filename: file.name,
            filetype: file.type,
          },
          uploadSize: file.size,
          chunkSize: 5000000,
          overridePatchMethod: false,
          onError: async (error) => {
            sub.error(error);
            return false;
          },
          onChunkComplete: (chunkSize, bytesAccepted, bytesTotal) => {
            sub.next({
              percent: Math.floor((bytesAccepted / bytesTotal) * 100),
            });
          },
          onSuccess: async () => {
            sub.next({ percent: 100 });
            sub.complete();
            return true;
          },
        });
        upload.start();
      })();
    });
    return obs;
  }
}
