import { pluck, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { IInteractionItem } from '../model';

const ADD_INTERACTION = gql`
  mutation addInteraction($idUser: ID!, $idComment: ID!) {
    addInteraction(idUser: $idUser, idComment: $idComment) {
      id
      id_user
      id_comment
    }
  }
`;

const REMOVE_YOUR_INTERACTION = gql`
  mutation removeInteraction($idUser: ID!, $idComment: ID!) {
    removeYourInteraction(idUser: $idUser, idComment: $idComment) {
      id
      id_user
      id_comment
    }
  }
`;
@Injectable()
export class InteractionService {
  constructor(private apollo: Apollo) {}

  public addInteraction(variables: {
    idUser: number;
    idComment: string;
  }): Promise<IInteractionItem[]> {
    return this.apollo
      .mutate({ mutation: ADD_INTERACTION, variables, fetchPolicy: 'no-cache' })
      .pipe(pluck('data', 'addInteraction'))
      .toPromise() as Promise<IInteractionItem[]>;
  }

  public removeInteraction(variables: {
    idUser: number;
    idComment: string;
  }): Promise<IInteractionItem[]> {
    return this.apollo
      .mutate({
        mutation: REMOVE_YOUR_INTERACTION,
        variables
      })
      .pipe(pluck('data', 'removeYourInteraction'))
      .toPromise() as Promise<IInteractionItem[]>;
  }
}
