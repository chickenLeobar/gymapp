import { TypeStateRequest } from '@core/models/credits.model';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'requestState',
})
export class StateRequestsPipe implements PipeTransform {
  transform(value: TypeStateRequest): string {
    return value == 'APPROVED' ? 'Aprovado' : 'Pendiente';
  }
}
