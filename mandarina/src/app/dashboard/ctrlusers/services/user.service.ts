import { ERol } from './../../../services/rol.service';
import { IUserView1 } from './../../../@core/models/User';
import { pluck, tap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { JwtService } from './../../../services/jwt.service';
import { Injectable } from '@angular/core';

import { gql, Apollo, QueryRef } from 'apollo-angular';
import { NzSafeAny } from 'ng-zorro-antd/core/types';

const FRAGEMNT_USER_VIEW_1 = gql`
  fragment user_view_1 on UserViewCtrl {
    name
    lastName
    code
    id
    email
    image
    rol
    create
    phone
    comfirmed
    online
    referrealCredits
    credits
    suspended
    lastTimeActive
    id_credit
  }
`;

const GET_USERS = gql`
  ${FRAGEMNT_USER_VIEW_1}
  query getUsers($idUser: ID!) {
    users(idUser: $idUser) {
      ...user_view_1
    }
  }
`;
// add manual credits

const MANUAL_CREDITS = gql`
  mutation addManualCredits($credits: Int!, $reason: String!, $idCredit: ID!) {
    addManualCredits(credits: $credits, reason: $reason, idCredit: $idCredit)
  }
`;

const UPDATE_ROL = gql`
  mutation updateRoles($roles: [Role!]!, $idUser: Int!) {
    updateRoles(roles: $roles, idUser: $idUser)
  }
`;
const UPDATE_REFERREAL_CREDITS = gql`
  mutation updateManualReferralCredit($credits: Int!, $idCredit: ID!) {
    addReferrealCredits(credits: $credits, idCredit: $idCredit)
  }
`;

const UPDATE_STATE = gql`
  mutation suspendAccount($state: Boolean!, $idUser: ID!) {
    suspendAccount(idUser: $idUser, state: $state)
  }
`;
const APLICATE_CREDITS_USERS = gql`
  mutation addCreditsGroupUsers(
    $reason: String!
    $credits: Int!
    $ids: [Int!]!
  ) {
    addCreditsGroupUsers(ids: $ids, reason: $reason, credits: $credits)
  }
`;
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
@Injectable()
@UntilDestroy()
export class UserService {
  private _queryRefUsers: QueryRef<NzSafeAny>;
  private $usersAll = new BehaviorSubject<IUserView1[]>([]);

  // expose
  public $userAllObs = this.$usersAll.asObservable();

  constructor(private apollo: Apollo, private jwtService: JwtService) {}
  init() {
    this.queryRefUsers()
      .valueChanges.pipe(pluck('data', 'users'))
      .subscribe((users) => {
        this.$usersAll.next(users);
      });
  }

  public refreshQuierUsers() {
    this.queryRefUsers().refetch();
  }
  // update state
  public updateState(variables: { idUser: number; state: boolean }) {
    return this.apollo.mutate({ mutation: UPDATE_STATE, variables: variables });
  }

  //
  public aplicateCreditUsers(variables: {
    reason: string;
    credits: number;
    ids: number[];
  }) {
    return this.apollo.mutate({ mutation: APLICATE_CREDITS_USERS, variables });
  }
  public updateReferrealCredits(variables: {
    credits: number;
    idCredit: string;
  }) {
    return this.apollo
      .mutate({
        mutation: UPDATE_REFERREAL_CREDITS,
        variables
      })
      .pipe(tap(console.log));
  }
  public addManualCredits(variables: {
    credits: number;
    reason?: string;
    idCredit: string;
  }) {
    return this.apollo
      .mutate({
        mutation: MANUAL_CREDITS,
        variables: variables
      })
      .pipe(pluck('data', 'addManualCredits'));
  }
  public updateRoles(variables: { roles: ERol[]; idUser: number }) {
    return this.apollo
      .mutate({ mutation: UPDATE_ROL, variables: variables })
      .pipe(tap(console.log));
  }
  queryRefUsers(): QueryRef<NzSafeAny> {
    if (!this._queryRefUsers) {
      this._queryRefUsers = this.apollo.watchQuery({
        query: GET_USERS,
        fetchPolicy: 'network-only',
        variables: {
          idUser: this.jwtService.getUserOfToken().id
        }
      });
      return this._queryRefUsers;
    } else {
      return this._queryRefUsers;
    }
  }
}
