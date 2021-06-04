import { Inotification, TEMPLATES_DEFAULT } from "./providers";
import { Repository, FindManyOptions } from "typeorm";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Notification, TypeNotification } from "./notifications.entity";
import { Inject, Service } from "typedi";
import { ResolverFilterData } from "type-graphql";

/*=====  End of Documentation  ======*/
//https://github.com/typeorm/typeorm-typedi-extensions#readme

@Service()
export class NotificationService {
  public static TOPIC_NOTIFICATION = "emitnotification";
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>
  ) // @Inject(TEMPLATES_DEFAULT)
  // private templates: Map<TypeNotification, Inotification>
  {}

  /*=============================================
 =            getNotificationOfUser            =
 =============================================*/
  public getNotificationsOfUser(
    pagination: { skip: number; take?: number },
    userid: number
  ) {
    let options = {} as FindManyOptions<Notification>;
    options.skip = pagination.skip;
    options.take = pagination.take || 10;
    options.where = { id_user: userid };
    options.order = { timeCreated: "DESC" };
    return this.notificationRepository.find(options);
  }
  public async readNotifications(idUser: number) {
    return await this.notificationRepository.update(
      { id_user: idUser },
      { read: true }
    );
  }

  /**
   * TODO:
   *  Algoritmo que limpie notificaciones
   * lo usuarios solo pueden tener hasta 20 notificaciones en la base de datos
   * si tiene mas que esto se debe conservar las 20 y eliminar el resto
   * pero eliminar uno por una seria mucho esfuerzo asi que el algoritmo debe ejecutarse
   * 20 notificaciones arriba de las 20 :)
   */

  /*=============================================
  =            FILTER DATA SUBSCRIPTION            =
  =============================================*/
  public static filteFunctionNotification({
    payload,
    args,
  }: ResolverFilterData<Notification, { idUser: number }>) {
    return payload.id_user == args.idUser;
  }
}
