import { IlistMessageItem } from './../model';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable()
export class ListMessageService {
  messages$ = new BehaviorSubject<IlistMessageItem[]>([]);
  constructor() {}
  updateLists(data: IlistMessageItem[]) {
    this.messages$.next(data);
  }
}
