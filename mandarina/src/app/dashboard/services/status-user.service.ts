import { IUser } from '@core/models/User';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Injectable } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { gql, Apollo } from 'apollo-angular';
const ONLINE = gql`
  mutation emitOnline($id: ID!) {
    onlineUser(id: $id)
  }
`;
@Injectable()
export class StatusUserService {
  public sub: Subscription;
  constructor(private jwtService: JwtHelperService, private apollo: Apollo) {
    this.emitOnlineStatus();
  }

  private emitOnlineStatus() {
    this.sub = interval(3000).subscribe(async (_) => {
      const user = this.jwtService.decodeToken<IUser>();
      if (user) {
        await this.apollo
          .mutate({ mutation: ONLINE, variables: { id: user.id } })
          .toPromise();
      } else {
        this.sub.unsubscribe();
      }
    });
  }
}
