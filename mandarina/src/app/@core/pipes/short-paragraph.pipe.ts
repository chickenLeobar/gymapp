import { Pipe, PipeTransform } from '@angular/core';
import { NgModule } from '@angular/core';
@Pipe({
  name: 'shortParagraph'
})
export class ShortParagraphPipe implements PipeTransform {
  /**
   *
   * @param value
   * @param count
   * @param firstWord ::si solo se requiere la primera palabra
   * @param includePoints
   * @returns
   */
  transform(
    value: string,
    count: number,
    firstWord: boolean,
    includePoints: boolean
  ): string {
    let points = true;
    let paragraphCount = 150;

    if (firstWord) {
      value = value.split(' ')[0];
    }

    let result = '';

    value = value.replace(/['"]+/g, '');

    if (count) {
      points = !(value.length <= count);
    } else {
      points = !(paragraphCount === value.length);
    }

    result = value.substring(0, count ?? paragraphCount);

    const revalue = `${result}${points ? '...' : ''}`;
    // console.log(revalue);

    return revalue;
  }
  quote = (val: string) => {
    return `"${val}"`;
  };
}

@NgModule({
  declarations: [ShortParagraphPipe],
  exports: [ShortParagraphPipe]
})
export class PipeShortParagraphModule {}
