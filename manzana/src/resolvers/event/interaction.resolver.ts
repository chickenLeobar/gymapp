import { LOGGER } from "./../../globals/constants";
import { StandarError } from "./../../utils/errors/shemaError";
import { InteractionEvent } from "./../../entity/events/Interaction";
import { Arg, Mutation, Resolver, ID } from "type-graphql";
import { Inject, Service } from "typedi";
@Resolver()
@Service()
export class InteractionResolver {
  constructor(@Inject(LOGGER) private Logger: Logger) {}
  @Mutation((type) => [InteractionEvent])
  async addInteractionEvent(
    @Arg("idEvent", (type) => ID) idEvent: number,
    @Arg("idUser", (type) => ID) idUser: number
  ) {
    await InteractionEvent.create({
      id_event: idEvent,
      id_user: idUser,
    }).save();
    return await InteractionEvent.find({ id_event: idEvent });
  }

  @Mutation((type) => [InteractionEvent])
  async removeInteractionEvent(
    @Arg("idEvent", (type) => ID) idEvent: number,
    @Arg("idUser", (type) => ID) idUser: number
  ) {
    const res = await InteractionEvent.delete({
      id_event: idEvent,
      id_user: idUser,
    });
    if (res?.affected) {
      return await InteractionEvent.find({ where: { id_event: idEvent } });
    }
  }
}
