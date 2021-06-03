import { SafeUrl } from '@angular/platform-browser';
import { UtilsService } from './../../services/utils.service';
import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'resolveUrl'
})
export class ResolveUrlPipe implements PipeTransform {
  constructor(private utils: UtilsService) {}
  transform(value: string, normal: boolean): SafeUrl {
    if (!value?.length) {
      return null;
    }
    if (normal) {
      return this.utils.resolveNormalPathImage(value);
    }
    return this.utils.resolvePathImage(value);
  }
}
import { NgModule } from '@angular/core';
@NgModule({
  declarations: [ResolveUrlPipe],
  imports: [],
  exports: [ResolveUrlPipe],
  providers: []
})
export class ResolveUrlPipeModule {}
