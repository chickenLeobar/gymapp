import { Injectable } from '@angular/core';
import { gql, Apollo } from 'apollo-angular';
import { tap, pluck } from 'rxjs/operators';
const ADD_INTERACTION = gql`
  mutation($idUser: ID!, $idEvent: ID!) {
    addInteractionEvent(idUser: $idUser, idEvent: $idEvent) {
      id_user
      id_event
    }
  }
`;

const REMOVE_YOUR_INTERACTION = gql`
  mutation($idUser: ID!, $idEvent: ID!) {
    removeInteractionEvent(idUser: $idUser, idEvent: $idEvent) {
      id_user
      id_event
    }
  }
`;

@Injectable()
export class InteractionServiceEvent {
  constructor(private apollo: Apollo) {}

  public addInteraction(variables: { idUser: number; idEvent: number }) {
    return this.apollo
      .mutate({ mutation: ADD_INTERACTION, variables })
      .pipe(pluck('data', 'addInteractionEvent'));
  }

  public removeInteraction(variables: { idUser: number; idEvent: number }) {
    return this.apollo
      .mutate({ mutation: REMOVE_YOUR_INTERACTION, variables })
      .pipe(pluck('data', 'removeInteractionEvent'));
  }
}
