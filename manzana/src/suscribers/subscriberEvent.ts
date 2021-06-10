import { Categorie } from "./../modules/categories/categorie.type";
import { Event } from "./../entity/events/Event";
import {
  EventSubscriber,
  EntitySubscriberInterface,
  InsertEvent,
  RemoveEvent,
} from "typeorm";

@EventSubscriber()
export class SubscriberEvent implements EntitySubscriberInterface<Event> {
  async afterInsert(event: InsertEvent<Event>) {
    await this.actionOncategoryCount("MORE", event.entity);
  }
  async afterRemove(event: RemoveEvent<Event>) {
    if (event.entity) {
      await this.actionOncategoryCount("MORE", event.entity);
    }
  }

  listenTo() {
    return Event;
  }
  private async actionOncategoryCount(
    typeAction: "MORE" | "LESS" = "MORE",
    event: Event
  ) {
    const categorie = await Categorie.findOne({
      id: event.category_id,
    });
    if (categorie) {
      let actionUpdate = {} as Partial<Categorie>;
      let amount = 1;
      if (typeAction == "LESS") {
        amount = amount * -1;
      }
      if (event.modeEvent === "PROGRAM") {
        actionUpdate.countPrograms = categorie.countPrograms + amount;
      } else {
        actionUpdate.countEvents = categorie.countEvents + amount;
      }
      const resp = await Categorie.update(event.category_id, actionUpdate);
    }
  }
}
