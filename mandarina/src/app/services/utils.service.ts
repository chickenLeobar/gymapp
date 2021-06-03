import { environment } from './../../environments/environment';
import { DomSanitizer } from '@angular/platform-browser';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  constructor(public str: DomSanitizer) {}

  resolvePathImage(urlPa: string) {
    const url = this.str.bypassSecurityTrustUrl(
      `${environment.apiUrl}/${urlPa}`
    );
    return url;
  }
  resolveNormalPathImage(urlPa: string) {
    return `${environment.apiUrl}/${urlPa}`;
  }
}
