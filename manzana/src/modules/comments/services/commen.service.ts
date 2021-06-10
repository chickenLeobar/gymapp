import { EntityManager } from "typeorm";
import { InjectManager } from "typeorm-typedi-extensions";
import { Service } from "typedi";
import { Comment } from "../entitites/Comment";
@Service()
export class CommentService {
  constructor(@InjectManager() private manager: EntityManager) {}

  public findRepliesOfComment(idComment: string): Promise<Comment[]> {
    return this.manager.find<Comment>(Comment, {
      where: { id_comment: idComment },
    });
  }
}
