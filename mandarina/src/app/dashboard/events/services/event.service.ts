import { JwtService } from '@services/jwt.service';
import { FileResponse } from '@core/models/reponses/response';
import { FetchResult, ApolloQueryResult } from '@apollo/client/core';
import { EventState } from 'src/app/@core/models/eventmodels/enums.event';
import { DetailEventAllResponse } from '@core/models/eventmodels/event.response';
import { EventResponse } from 'src/app/@core/models/eventmodels/event.response';
import { IEvent } from 'src/app/@core/models/eventmodels/event.model';
import { Injectable } from '@angular/core';
import { gql, Apollo } from 'apollo-angular';
import { Observable, of } from 'rxjs';
import { FRAGMENTSESION } from './sesion.service';
import { tap, catchError, pluck } from 'rxjs/operators';
import { EVENTFRAGMENT } from '@fragments/event.fragment';
import { CATEGORIE_FRAGMENT } from '@fragments/categorie';

import { ActionService } from '@services/action.service';
import { Icategorie } from '../../categorie/model.categorie';

const CREATEEVENT = gql`
  ${EVENTFRAGMENT}
  mutation createEvent($eventInput: InputEvent!) {
    createEvent(event: $eventInput) {
      resp
      event {
        ...eventFragment
      }
      errors {
        code
        message
      }
    }
  }
`;
const ALL_CATEGORIEE = gql`
  ${CATEGORIE_FRAGMENT}
  query getCategorie($idCategorie: ID) {
    categories(idCategorie: $idCategorie) {
      ...categorieFragment
    }
  }
`;

const EDITEVENT = gql`
  ${EVENTFRAGMENT}
  mutation editEvent($id: Int!, $event: InputEvent!) {
    editEvent(id: $id, event: $event) {
      resp
      event {
        ...eventFragment
      }
      errors {
        code
        message
      }
    }
  }
`;
const UPLOADCOVEREVENT = gql`
  mutation addImageEvent($idEvent: Int!, $picture: Upload!) {
    addCoverEvent(idevent: $idEvent, picture: $picture) {
      resp
      errors {
        code
        message
      }
      path
    }
  }
`;

const GETEVENT = gql`
  ${EVENTFRAGMENT}
  ${FRAGMENTSESION}
  query getEvent($id: ID!) {
    event(id: $id) {
      ...eventFragment
      sesions {
        ...sesionFragment
      }
    }
  }
`;

const GETEVENTWITHSESION = gql`
  ${FRAGMENTSESION}
  ${EVENTFRAGMENT}
  query getEvent($id: ID!) {
    event(id: $id) {
      ...eventFragment
      sesions {
        ...sesionFragment
      }
    }
  }
`;
const GETEVENTS = gql`
  ${EVENTFRAGMENT}
  query getEvents {
    getEvents {
      ...eventFragment
    }
  }
`;

const GETEVENTSOFUSER = gql`
  ${FRAGMENTSESION}
  ${EVENTFRAGMENT}
  query getEvents($idUser: Int!) {
    getEventsOfUser(idUser: $idUser) {
      resp
      errors {
        code
        message
      }
      events {
        ...eventFragment
        sesions {
          ...sesionFragment
          event {
            ...eventFragment
          }
        }
      }
    }
  }
`;

@Injectable()
export class EventService {
  constructor(
    private apollo: Apollo,
    private jwtService: JwtService,
    private actionService: ActionService
  ) {}

  public addEvent(
    event: IEvent
  ): Observable<FetchResult<{ createEvent: EventResponse }>> {
    let publishDate = null;
    try {
      publishDate = event.publishedDate.getTime();
    } catch (error) {
      publishDate = null;
    }
    const user = this.jwtService.getUserOfToken();
    return this.apollo
      .mutate<{ createEvent: EventResponse }>({
        mutation: CREATEEVENT,
        variables: {
          eventInput: {
            name: event.name,
            video: event.video,
            capacityAssistant: event.capacityAssistant,
            published: EventState[event.published],
            description: event.description,
            publishedDate: publishDate,
            includeComments: event.includeComments,
            cloudinarySource: event.cloudinarySource,
            id_resource: Number(event.id_resource),
            includeVideo: event.includeVideo,
            modeEvent: event.modeEvent,
            id_user: user.id,
            category_id: event.category_id,
            credits: event.credits
          }
        }
      })
      .pipe(
        tap(() => {
          /// emit add event in components
          this.actionService.emitEventHandler('ADDEVENT');
          this.actionService.emitEventHandler('REFETCHEVENTS');
        })
      );
  }

  public getCategories(idCategorie?: number): Observable<Icategorie[]> {
    return this.apollo
      .query({
        query: ALL_CATEGORIEE,
        variables: {
          idCategorie
        }
      })
      .pipe(pluck('data', 'categories'));
  }

  /*=============================================
 =            get event of user            =
 =============================================*/

  public getEventsOfUser(idUser: number) {
    return this.apollo.watchQuery<{ getEventsOfUser: DetailEventAllResponse }>({
      query: GETEVENTSOFUSER,
      variables: {
        idUser
      }
    });
  }
  public uploadFile(
    file: File,
    id: number
  ): Observable<FetchResult<{ addCoverEvent: FileResponse }>> {
    return this.apollo.mutate<{ addCoverEvent: FileResponse }>({
      mutation: UPLOADCOVEREVENT,
      variables: {
        picture: file,
        idEvent: Number(id)
      },
      context: {
        useMultipart: true
      }
    });
  }

  public getEvent(
    id: number,
    includeSesions?: boolean
  ): Observable<ApolloQueryResult<{ event: IEvent }>> {
    return this.apollo.query<{ event: IEvent }>({
      query: includeSesions ? GETEVENTWITHSESION : GETEVENT,
      variables: {
        id: id
      }
    });
  }
  // get events

  public getEvents() {
    return this.apollo.query<{ getEvents: IEvent[] }>({
      query: GETEVENTS
    });
  }

  // edit event in server
  public editEvent(
    id: number,
    event: IEvent
  ): Observable<FetchResult<{ editEvent: EventResponse }>> {
    let publishDate = null;
    try {
      publishDate = event.publishedDate.getTime();
    } catch (error) {
      publishDate = null;
    }
    return this.apollo
      .mutate<{ editEvent: EventResponse }>({
        mutation: EDITEVENT,
        variables: {
          event: {
            name: event.name,
            capacityAssistant: event.capacityAssistant,
            published:
              typeof event.published == 'number'
                ? EventState[event.published]
                : event.published,
            description: event.description,
            publishedDate: publishDate,
            includeComments: event.includeComments,
            cloudinarySource: event.cloudinarySource,
            includeVideo: event.includeVideo,
            modeEvent: event.modeEvent,
            category_id: event.category_id,
            credits: event.credits
          },
          id: Number(id)
        }
      })
      .pipe(
        tap((el) => {
          this.actionService.emitEventHandler('REFETCHEVENTS');
        })
      );
  }
}
