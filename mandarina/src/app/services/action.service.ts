import { Injectable } from '@angular/core';
import { Subject, Observable, Observer, Subscriber } from 'rxjs';

type typesEvents = 'ADDEVENT' | 'EDITEVENT' | 'REFETCHEVENTS';

interface Action<T> {
  type: typesEvents;
  observer: Observer<T>;
}

@Injectable({
  providedIn: 'root'
})
export class ActionService {
  private count: number = 0;
  private handleEvent: Subject<typesEvents> = new Subject<typesEvents>();

  private registerObs = new Map<typesEvents, number[]>();

  constructor() {
    // this.handleEvent.
    this.count = this.count + 1;
  }

  /**
   *  name handle update events
   * @param event : TypesEvents
   */

  public emitEventHandler(event: typesEvents) {
    // this.handleEvent.next(event);
    const handler = this.registerObs.get(event);
    console.log(handler);
    if (handler) {
      handler.forEach((index) => {
        const observer = this.handleEvent.observers[index];
        if (observer) {
          observer.next(event);
        }
      });
    }

    return;
  }

  public suscribeEvents(typeAction?: typesEvents): Observable<typesEvents> {
    const eventType = this.registerObs.get(typeAction);
    let arr = [];
    if (eventType) {
      arr = [...eventType];
    }
    arr.push(this.handleEvent.observers.length);
    this.registerObs.set(typeAction, arr);
    const obs = this.handleEvent.asObservable();
    return obs;
  }
}
