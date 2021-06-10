import { Event } from "./../../entity/events/Event";
import { EntityManager } from "typeorm";
import { Service } from "typedi";
import { InjectManager } from "typeorm-typedi-extensions";
import { Logger } from "../../services/logger.service";
import { EventState } from "../../enums/Event.enums";
@Service()
export class EventService {
  constructor(
    @InjectManager() private manager: EntityManager,
    private logger: Logger
  ) {}

  /**
   * cambia el estado del evento
   * cuando este llega a su fecha
   * Se completa cada vez que se pide el
   * feed de eventos
   */
  public async changueStateEvent({ id }: { id: number }) {
    const res = await this.manager.update<Event>(Event, id, {
      published: EventState.PUBLIC,
    });
    if (res?.affected) {
      this.logger.info({
        info: "Se ha publicado un nuevo evento",
      });
    } else {
      this.logger.error({
        info: "NO se podido actulizar un evento a publicado",
      });
    }
  }
}
