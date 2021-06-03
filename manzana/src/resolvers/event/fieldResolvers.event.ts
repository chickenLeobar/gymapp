import { EntityManager } from "typeorm";
import { InjectManager } from "typeorm-typedi-extensions";
import { InteractionEvent } from "./../../entity/events/Interaction";
import { Resolver, ResolverInterface, FieldResolver, Root } from "type-graphql";
import { Service } from "typedi";
import { Event } from "../../entity/events/Event";

@Resolver((type) => Event)
@Service()
export class FieldsResolverEvent implements ResolverInterface<Event> {
  constructor(@InjectManager() private manager: EntityManager) {}

  @FieldResolver()
  async interactions(@Root() event: Event) {
    return await this.manager.find<InteractionEvent>(InteractionEvent, {
      where: { id_event: event.id },
    });
  }
}
