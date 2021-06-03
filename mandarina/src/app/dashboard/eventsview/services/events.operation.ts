import { tap, pluck } from 'rxjs/operators';
import { IEvent } from '@core/models/eventmodels/event.model';
import { Injectable } from '@angular/core';

import { Apollo, gql } from 'apollo-angular';
import { EVENTFRAGMENT } from '@fragments/event.fragment';
export type MODEEVENT = 'EVENT' | 'PROGRAM';
import { Observable } from 'rxjs';
export type eventsCategoryOperations = {
  idCategory: number;
  modeEvent?: MODEEVENT;
  recents?: boolean;
};

export interface IResponseEvents {
  items: IEvent[];
  count: number;
}

/*=============================================
=            QUERIES            =
=============================================*/

const GET_EVENTS_ON_CATEGORIE = gql`
  ${EVENTFRAGMENT}
  query($idCategory: ID!, $modeEvent: String, $recents: Boolean) {
    eventsCategory(
      idCategory: $idCategory
      modeEvent: $modeEvent
      recents: $recents
    ) {
      items {
        ...eventFragment
      }
      count
    }
  }
`;

@Injectable()
export class EventsOperationService {
  constructor(private apollo: Apollo) {}

  public getEventOfCategory(
    args: eventsCategoryOperations
  ): Observable<IEvent[]> {
    return this.apollo
      .query({
        query: GET_EVENTS_ON_CATEGORIE,
        variables: {
          ...args,
        },
      })
      .pipe(pluck('data', 'eventsCategory', 'items'));
  }
}
