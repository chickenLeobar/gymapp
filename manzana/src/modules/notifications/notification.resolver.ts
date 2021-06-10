import { NotificationService } from "./notification.service";
import { PaginationParams } from "./../../types/generic/args.pagination";
import { Notification } from "./notifications.entity";
import { Service } from "typedi";
import {
  Arg,
  Args,
  ID,
  Int,
  Mutation,
  PubSub,
  Query,
  Resolver,
  Root,
  Subscription,
} from "type-graphql";

import { PubSubEngine } from "type-graphql";
@Service()
@Resolver()
export class NotificationResolver {
  constructor(private notifyService: NotificationService) {}
  @Query((type) => [Notification])
  async notification(
    @Args() { skip, take }: PaginationParams,
    @Arg("idUser", () => Int) idUser: number
  ) {
    const notification = await this.notifyService.getNotificationsOfUser(
      { skip, take },
      idUser
    );
    return notification;
  }

  /*=============================================
  =            emit last notification in real time            =
  =============================================*/
  @Subscription((type) => Notification, {
    topics: [NotificationService.TOPIC_NOTIFICATION],
    filter: NotificationService.filteFunctionNotification,
  })
  async subNotfications(
    @Root() payload: any,
    @Arg("idUser", (type) => ID) idUser: number
  ): Promise<Notification | null> {
    const time = new Date(payload.timeCreated);
    return { ...payload, timeCreated: time };
  }

  @Mutation((type) => Boolean)
  async readNotifications(@Arg("idUser", (type) => Int) idUser: number) {
    await this.notifyService.readNotifications(idUser);
    return true;
  }

  // @Mutation((type) => Boolean)
  // async createNotification(
  //   @PubSub() publisher: PubSubEngine,
  //   @Arg("idUser", (type) => ID) idUser: number
  // ) {
  //   const resource = Notification.create({
  //     id_user: idUser,
  //     title: "!tienes un nuevo referido!",
  //     description: "Susana se ha unido  a tu equipo",
  //     link: "",
  //     type: "EVENT",
  //   });
  //   const notificaitonSave = await resource.save();
  //   await publisher.publish(
  //     NotificationService.TOPIC_NOTIFICATION,
  //     notificaitonSave
  //   );
  //   return true;
  // }
}
