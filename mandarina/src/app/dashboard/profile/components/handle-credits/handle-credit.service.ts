import { IReuestCredit } from './../../../../@core/models/credits.model';
import { pluck, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { gql, Apollo, QueryRef } from 'apollo-angular';
import { Observable } from 'rxjs';
import { IHistorialCredit } from '@core/models/credits.model';
const GET_HISTORIAL = gql`
  query getHistorial($idCredit: ID!) {
    historialCredits(idCredit: $idCredit) {
      id
      credits
      reason
      emit
    }
  }
`;
const GET_REQUEST_CREDITS = gql`
  query getRequestCredits($idCredit: ID!) {
    getRequestCredits(idCredit: $idCredit) {
      id
      id_credit
      credits
      description
      created
      id_responsable
      state
    }
  }
`;

const REQUEST_CREDITS = gql`
  mutation requestTransaction($input: InputRequest!) {
    requesCredits(input: $input) {
      id
      state
      created
      credits
    }
  }
`;
@Injectable()
export class HandleCreditService {
  public refHistorial: QueryRef<any>;
  public refRequestCredits: QueryRef<any>;
  constructor(private apollo: Apollo) {}

  public initQueries(id: string) {
    this.getHistorialCredits(id);
    this.getRequestCredits(id);
  }
  private getHistorialCredits(id: string) {
    this.refHistorial = this.apollo.watchQuery({
      query: GET_HISTORIAL,
      variables: {
        idCredit: id,
      },
    });
  }

  public requestCredits(
    data: Pick<IReuestCredit, 'id_credit' | 'credits' | 'description'>
  ) {
    return this.apollo
      .mutate({
        mutation: REQUEST_CREDITS,
        variables: {
          input: {
            ...data,
          },
        },
      })
      .pipe(tap(console.log));
  }

  private getRequestCredits(id: string) {
    this.refRequestCredits = this.apollo.watchQuery({
      query: GET_REQUEST_CREDITS,
      variables: {
        idCredit: id,
      },
    });
  }

  valueChanguesRequestCredits() {
    return this.refRequestCredits.valueChanges.pipe(
      pluck('data', 'getRequestCredits')
    );
  }
  valuechangueHistorial(): Observable<IHistorialCredit[]> {
    return this.refHistorial.valueChanges.pipe(
      pluck('data', 'historialCredits')
    );
  }
}
