import { pluck, tap } from 'rxjs/operators';
import { IUser } from './../../../@core/models/User';
import { JwtService } from './../../../services/jwt.service';
import { Injectable } from '@angular/core';
import { Inotification } from './model.notification';
import { gql, Apollo, QueryRef } from 'apollo-angular';
import { BehaviorSubject } from 'rxjs';
import _ from 'lodash';
const FRAGMENT_NOTIFICATION = gql`
  fragment fragmentNotification on Notification {
    id
    title
    description
    title
    timeCreated
    type
    read
  }
`;
const NOTIFICATION_SUB = gql`
  ${FRAGMENT_NOTIFICATION}
  subscription getNotifications($idUser: ID!) {
    subNotfications(idUser: $idUser) {
      ...fragmentNotification
    }
  }
`;
const NOTIFICATION_QUERY = gql`
  ${FRAGMENT_NOTIFICATION}
  query getNotification($idUser: Int!, $skip: Int, $take: Int) {
    notification(idUser: $idUser, skip: $skip, take: $take) {
      ...fragmentNotification
    }
  }
`;

const READ_NOTIFICATIONS = gql`
  mutation readNotifications($idUser: Int!) {
    readNotifications(idUser: $idUser)
  }
`;

@Injectable()
export class NotificationService {
  private queryAllNotification: QueryRef<{ notification: Inotification[] }>;
  private notification$ = new BehaviorSubject<Inotification[]>([]);
  private currentUser: IUser;
  constructor(private apollo: Apollo, private jwtService: JwtService) {
    this.currentUser = this.jwtService.getUserOfToken();
  }

  initConfigurations() {
    this.buildQueryNotication();
  }
  // create notfication
  private buildQueryNotication() {
    this.queryAllNotification = this.apollo.watchQuery({
      query: NOTIFICATION_QUERY,
      variables: {
        idUser: this.currentUser.id,
      },
    });

    this.queryAllNotification.subscribeToMore<{
      subNotfications: Inotification;
    }>({
      document: NOTIFICATION_SUB,
      variables: {
        idUser: this.currentUser.id,
      },
      updateQuery: (prev, { subscriptionData }) => {
        let notificationsReturn = [];
        notificationsReturn = [
          _.get(subscriptionData, ['data', 'subNotfications']),
          ...prev.notification,
        ];

        return {
          ...prev,
          notification: notificationsReturn,
        };
      },
    });
  }

  public readNotifications() {
    return this.apollo
      .mutate({
        mutation: READ_NOTIFICATIONS,
        variables: {
          idUser: this.currentUser.id,
        },
      })
      .pipe(pluck('data', 'readNotifications'))
      .toPromise();
  }

  public get notifications() {
    return this.queryAllNotification.valueChanges.pipe(
      pluck('data', 'notification')
    );
  }
}
