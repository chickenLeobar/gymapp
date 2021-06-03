import { IMessage } from './../model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class ConversationService {
  private onNewMessage$ = new Subject<IMessage>();

  // expose

  // public
  public onNewMessageSub$ = this.onNewMessage$.asObservable();
  constructor() {}

  public newMessage(message: IMessage) {
    this.onNewMessage$.next(message);
  }
}
