import { COMMENTACTION } from "../../../globals/subs/comment.utils";
import { CRUD_ACTION } from "./../../../globals/types";
import { IPayloadSubComment } from "./../../../globals/subs/comment.utils";
import { PUB_SUB_INSTANCE } from "./../../../globals/constants";
import { Interaction } from "./../entitites/Interaction";
import { Arg, ID, Mutation, PubSubEngine, Resolver } from "type-graphql";
import { InteractionType } from "../types/model";
import { Service, Inject } from "typedi";

import { Comment } from "../entitites/Comment";
@Resolver()
@Service()
export class interactionResolver {
  constructor(@Inject(PUB_SUB_INSTANCE) private pubSub: PubSubEngine) {}
  @Mutation((type) => [Interaction])
  public async addInteraction(
    @Arg("idComment", (type) => ID) idComment: string,
    @Arg("idUser", (type) => ID) idUser: number,
    @Arg("typeInteraction", (type) => String, { nullable: true })
    typeInteraction: InteractionType = "LIKE"
  ) {
    const interaction = Interaction.create({
      typeInteraction: typeInteraction,
      id_user: idUser,
      id_comment: idComment,
    });
    await interaction.save();
    await this.emitChangueComment(idComment, "UPDATE");
    return Interaction.find({ where: { id_comment: idComment } });
  }

  private async emitChangueComment(idComment: string, action: CRUD_ACTION) {
    const comment = await Comment.findOne({ id: idComment });
    await this.pubSub.publish(COMMENTACTION.UPDATE, {
      action: action,
      idBootstrap: comment?.id_bootstrap,
      idParentComment: comment?.id_comment,
      comment: comment,
    } as IPayloadSubComment);
  }

  @Mutation((type) => [Interaction])
  public async removeYourInteraction(
    @Arg("idComment", (type) => ID) idComment: string,
    @Arg("idUser", (type) => ID) idUser: number
  ) {
    const res = await Interaction.delete({
      id_comment: idComment,
      id_user: idUser,
    });
    await this.emitChangueComment(idComment, "UPDATE");
    return Interaction.find({ id_comment: idComment });
  }
}
