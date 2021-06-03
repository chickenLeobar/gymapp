import { GraphQLError } from "graphql";
import { ChatUtilsService } from "./../../modules/chat/utils/utils";
import { User } from "./../../entity/User";
import { EntityManager } from "typeorm";
import { UserStateResponse } from "./../../types/User";
import { TopicsSubscription } from "./../../globals/constants";
import {
  Mutation,
  Resolver,
  Arg,
  ID,
  Subscription,
  Root,
  ResolverFilterData,
} from "type-graphql";
import { Service } from "typedi";
import { HandleStateUser } from "../../services/user.state";
import { typeOnlineEvent } from "../../types/User";
import { InjectManager } from "typeorm-typedi-extensions";

@Service()
@Resolver()
export class StatusUserResolver {
  constructor(
    private stateUserService: HandleStateUser,
    @InjectManager() private manager: EntityManager,
    private chatUtilsService: ChatUtilsService
  ) {}
  @Mutation((type) => Boolean)
  async onlineUser(@Arg("id", (type) => ID) id: number) {
    this.stateUserService.stablishOnline(String(id), id);
    return true;
  }

  @Subscription((type) => UserStateResponse, {
    topics: [
      TopicsSubscription.DISCONNECT_USER,
      TopicsSubscription.CONNECT_USER,
    ],
    filter: ({
      payload,
      args,
    }: ResolverFilterData<
      { id: number; event: typeOnlineEvent },
      { idUser: number }
    >) => {
      return payload.id !== args.idUser;
    },
  })
  async connectionUser(
    @Root() payload: { id: number; event: typeOnlineEvent },
    @Arg("idUser", (type) => ID) idUser: number
  ) {
    const user = await this.manager.findOne<User>(User, { id: payload.id });
    if (!user) {
      throw new GraphQLError(
        "Subscription:connectionUser : user provide id was not found"
      );
    }
    return {
      ...payload,
      user: this.chatUtilsService.converUserEntity(user),
    };
  }
}
