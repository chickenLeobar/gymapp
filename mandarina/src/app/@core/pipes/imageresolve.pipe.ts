import { UtilsService } from '@services/utils.service';
import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Pipe({
  name: 'imageresolve',
})
export class ImageresolvePipe implements PipeTransform {
  constructor(private utils: UtilsService) {}
  transform(value: string): SafeUrl {
    return this.utils.resolvePathImage(value);
  }
}
