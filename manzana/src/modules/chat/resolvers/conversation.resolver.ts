import { PaginationParams } from "./../../../types/generic/args.pagination";
import { HandleStateUser } from "./../../../services/user.state";
import { ChatUtilsService } from "./../utils/utils";
import { UserChat } from "./../../../types/User";
import { MessageView } from "./../views/message.view";
import { EntityManager } from "typeorm";
import { Conversation } from "./../entities/Conversation";
import {
  Resolver,
  FieldResolver,
  Root,
  Query,
  Arg,
  ID,
  ResolverInterface,
  Args,
} from "type-graphql";
import { Service } from "typedi";
import { InjectManager } from "typeorm-typedi-extensions";
@Resolver((type) => Conversation)
@Service()
export class ResolverConversatio implements ResolverInterface<Conversation> {
  constructor(
    @InjectManager() private manager: EntityManager,
    private utils: ChatUtilsService,
    private stateUserService: HandleStateUser
  ) {}
  @FieldResolver((type) => [MessageView])
  async messages(
    @Root() conversation: Conversation,
    @Args() { skip, take }: PaginationParams
  ): Promise<MessageView[]> {
    const messages = await this.manager.find<MessageView>(MessageView, {
      where: { id_conversation: conversation.id },
      order: { created: "DESC" },
    });

    return messages;
  }
  @Query((type) => Conversation)
  async conversation(@Arg("id", (type) => ID) id: number) {
    return await Conversation.findOne(id);
  }

  @FieldResolver((type) => [UserChat])
  async members(@Root() conversation: Conversation) {
    const users = await conversation.participants;
    return users.map((el) => this.utils.converUserEntity(el));
  }
}
