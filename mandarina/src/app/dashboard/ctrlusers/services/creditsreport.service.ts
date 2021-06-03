import { IRequestCredit } from './../../../@core/models/requestCredits';
import { tap, pluck, map } from 'rxjs/operators';
import { JwtService } from '@services/jwt.service';
import { Injectable } from '@angular/core';
import { Apollo, gql, QueryRef } from 'apollo-angular';
import { Observable } from 'rxjs';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import compareAsc from 'date-fns/compareAsc';
const GET_REQUEST_CREDIT_FOR_ATTEND = gql`
  query requestXAttend($idUser: Int!) {
    getRequestRequestforAttend(idUser: $idUser) {
      id_request
      state
      description
      userName
      idUser
      lastName
      currentCredits
      referrealCredits
      id_credit
      created
      id_responsable
      credits
    }
  }
`;
const APROVED_CREDITS = gql`
  mutation aprovedCredits($credits: Int!, $idRequest: ID!) {
    aproveCredits(credits: $credits, idRequest: $idRequest)
  }
`;
@Injectable()
export class CreditsreportService {
  constructor(private apollo: Apollo, private jwtService: JwtService) {}
  _queryRefCredits: QueryRef<NzSafeAny>;

  private get queryRefCredits() {
    if (this._queryRefCredits) {
      return this._queryRefCredits;
    } else {
      this._queryRefCredits = this.apollo.watchQuery({
        query: GET_REQUEST_CREDIT_FOR_ATTEND,
        variables: {
          idUser: this.jwtService.getUserOfToken().id
        }
      });
      return this._queryRefCredits;
    }
  }
  private orderData(requests: IRequestCredit[]) {
    const data = Object.assign([] as IRequestCredit[], requests).sort(
      (a, b) => {
        const aisPending = a.state == 'PENDDING';
        const bisPending = b.state == 'PENDDING';
        return aisPending === bisPending ? 0 : a.state == 'APPROVED' ? 1 : -1;
      }
    );

    return data;
  }

  public getRequestforAttend(): Observable<IRequestCredit[]> {
    return this.queryRefCredits.valueChanges.pipe(
      pluck('data', 'getRequestRequestforAttend'),
      map((data) => this.orderData(data))
    );
  }

  public refreshRequests() {
    this.queryRefCredits.refetch();
  }
  /// aprove request

  public aprovedCredits(variables: { credits: number; idRequest: number }) {
    return this.apollo
      .mutate({
        mutation: APROVED_CREDITS,
        variables: variables
      })
      .pipe(tap((d) => console.log(d)));
  }
}
