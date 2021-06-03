import { TopicsSubscription } from "./../../../globals/constants";
import { Comment } from "./../entitites/Comment";

import { InputComment } from "../types/InputComment";
import {
  Arg,
  Int,
  Mutation,
  Query,
  Resolver,
  PubSub,
  Subscription,
  Publisher,
  Root,
  ResolverInterface,
  FieldResolver,
  ID,
  ResolverFilterData,
} from "type-graphql";
import { FindManyOptions } from "typeorm";
import {
  COMMENTACTION,
  IPayloadSubComment,
  filterFunction as filterCommentAction,
  CommentSubResponse,
} from "../../../globals/subs/comment.utils";
import { Service } from "typedi";

/*=============================================
=           
 TODO:
 [x] create comments
 [x] notify comments handle
 [ ] helpers for sub comment
 [ ] edit and delete comments
 [ ] likes in comment
 [ ] replies
=
=============================================*/
import { CommentService } from "../services/commen.service";
import _ from "lodash";

@Resolver((type) => Comment)
@Service()
export class CommentResolver implements ResolverInterface<Comment> {
  constructor(private commentService: CommentService) {}

  @Mutation((type) => Comment)
  async addComment(
    @Arg("comment", (type) => InputComment) inputComent: InputComment,
    @PubSub(COMMENTACTION.CREATE)
    publishAddComment: Publisher<IPayloadSubComment>
  ) {
    const commentBd = Comment.create(inputComent);
    const bdComment = await commentBd.save();
    await publishAddComment({
      idBootstrap: commentBd?.id_bootstrap,
      idParentComment: commentBd?.id_comment,
      comment: bdComment,
      action: "CREATE",
    });
    return bdComment;
  }

  @Query((type) => [Comment])
  async getComments(
    @Arg("bootstrap", () => Int, { nullable: true }) idBootstrap: number
  ) {
    let options = {} as FindManyOptions<Comment>;
    if (idBootstrap) {
      options.where = { id_bootstrap: idBootstrap };
    }
    return await Comment.find(options);
  }

  @Query((type) => Comment)
  async getComment(
    @Arg("idComment", (type) => String, { nullable: true }) idComment: string
  ) {
    return Comment.findOne({ id: idComment });
  }

  /*=============================================
  =            Subscriptions            =
  =============================================*/

  @Subscription((type) => CommentSubResponse, {
    topics: [COMMENTACTION.CREATE, COMMENTACTION.DELETE, COMMENTACTION.UPDATE],
    filter: filterCommentAction,
  })
  async actionComment(
    @Root() payload: IPayloadSubComment,
    @Arg("idComment", (type) => ID, { nullable: true }) idComment?: string,
    @Arg("bootstrap", (type) => Int, { nullable: true }) bootstrap?: number
  ): Promise<CommentSubResponse> {
    console.log("respond", "idComment");

    if (!payload.comment) {
      payload.comment = await Comment.findOne({ id: payload.idComment });
    }
    return {
      comment: payload.comment,
      action: payload.action,
    };
  }

  /*=============================================
  =            Field Resolvers            =
  =============================================*/

  @FieldResolver()
  replies(@Root() comment: Comment) {
    return this.commentService.findRepliesOfComment(comment.id);
  }
}
