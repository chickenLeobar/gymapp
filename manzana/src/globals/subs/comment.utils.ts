import { CRUD_ACTION } from "../types";
import { Comment } from "../../modules/comments/entitites/Comment";
import { ResolverFilterData } from "type-graphql";
import { ObjectType, Field } from "type-graphql";
import _ from "lodash";
export enum COMMENTACTION {
  UPDATE = "updateComment",
  CREATE = "createComment",
  DELETE = "deleteComment",
}

export interface IPayloadSubComment {
  idBootstrap?: number;
  // idComment for replies
  idParentComment?: string;
  action?: CRUD_ACTION;
  comment?: Comment;

  /**
   *  is is necesaruy search comment for id
   */
  idComment?: string;
}

export const filterFunction = ({
  payload,
  args,
}: ResolverFilterData<
  IPayloadSubComment,
  { bootstrap: number; idComment: string }
>) => {
  if (!args.bootstrap) {
    //  if required all comments
    // suscribes for replies
    return args.idComment == payload.idParentComment;
  } else {
    // suscribe in principal box
    return payload.idBootstrap == args.bootstrap;
  }

  // required comment onluy bootstrap
};

@ObjectType()
export class CommentSubResponse {
  @Field()
  action?: string;

  @Field((type) => Comment)
  comment?: Comment;
}
