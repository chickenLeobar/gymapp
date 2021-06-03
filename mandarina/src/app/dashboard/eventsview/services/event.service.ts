import { Injectable } from '@angular/core';
import { gql, Apollo } from 'apollo-angular';
/*=============================================
=             graphql            =
=============================================*/

import { IDetailResponse } from '@core/models/eventmodels/event.response';
const ATTEND_SESION = gql`
  mutation attendEvent($idUser: Int!, $idEvent: Int!) {
    attendEvent(idUser: $idUser, idEvent: $idEvent) {
      resp
      timeAttend
      errors {
        code
        message
      }
    }
  }
`;
const ISATTENDEVENT = gql`
  query isAttendEvent($idUser: Int!, $idEvent: Int!) {
    isRegisterEvent(idUser: $idUser, idEvent: $idEvent) {
      resp
      timeAttend
    }
  }
`;
@Injectable()
export class EventService {
  constructor(private apollo: Apollo) {}
  public registerEvent(idUser: number, idEvent: number) {
    return this.apollo.mutate<{ attendEvent: IDetailResponse }>({
      mutation: ATTEND_SESION,
      variables: {
        idUser: idUser,
        idEvent: idEvent
      }
    });
  }
  public isRegisterinEvent(idUser: number, idEvent: number) {
    return this.apollo.watchQuery<{ isRegisterEvent: IDetailResponse }>({
      query: ISATTENDEVENT,
      variables: {
        idUser: idUser,
        idEvent: idEvent
      }
    });
  }
}
