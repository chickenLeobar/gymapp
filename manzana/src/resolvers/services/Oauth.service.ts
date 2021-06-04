import { Repository } from "typeorm";
import { Notification } from "./../../modules/notifications/notifications.entity";
import { InjectRepository } from "typeorm-typedi-extensions";
import { NotificationService } from "./../../modules/notifications/notification.service";

import { Inject, Service } from "typedi";
import { PubSubEngine } from "type-graphql";
import {
  Inotification,
  TEMPLATES_DEFAULT,
} from "../../modules/notifications/providers";
import { TypeNotification } from "../../modules/notifications/notifications.entity";
import format from "string-template";
import { PUB_SUB_INSTANCE } from "../../globals/constants";

@Service()
export class OAuthService {
  constructor(
    @Inject(PUB_SUB_INSTANCE) private pubsub: PubSubEngine,
    @Inject(TEMPLATES_DEFAULT)
    private templates: Map<TypeNotification, Inotification>,
    @InjectRepository(Notification)
    private notification: Repository<Notification>
  ) {}

  public async notifyNewReferreal(name: string, sponsor: number) {
    const template = this.templates.get("REFER");
    const data = {
      type: "REFER",
      title: template?.title,
      description: format(template?.description || "", {
        name: name,
      }),
      id_user: sponsor,
    } as Partial<Notification>;
    const resource = this.notification.create({ ...data });
    const notificaitonSave = await resource.save();
    console.log(notificaitonSave.timeCreated);
    await this.pubsub.publish(
      NotificationService.TOPIC_NOTIFICATION,
      notificaitonSave
    );
    console.log("published");
  }
}
