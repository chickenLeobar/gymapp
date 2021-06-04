import { Interaction } from "./../entitites/Interaction";
import { EntityManager } from "typeorm";
import { InjectManager } from "typeorm-typedi-extensions";
import { Service } from "typedi";

@Service()
export class InteractionService {
  constructor(@InjectManager() private manager: EntityManager) {}
  public searchInteractionOfComment(idComment: string) {
    return this.manager.find<Interaction>(Interaction, {
      where: { id_comment: idComment },
    });
  }
}
