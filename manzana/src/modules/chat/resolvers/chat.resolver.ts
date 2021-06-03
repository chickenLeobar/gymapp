import { StandarError } from "./../../../utils/errors/shemaError";
import { ChatUtilsService } from "./../utils/utils";
import { Categorie } from "./../../categories/categorie.type";
import { ChatService } from "./../services/chat.service";
import { UserChat } from "./../../../types/User";
import { User } from "./../../../entity/User";
import { HandleStateUser } from "./../../../services/user.state";
import { RecentMessages } from "./../views/RecentCoversation.view";
import { EntityManager, In, Not, Equal, Any, Raw } from "typeorm";
import { Service } from "typedi";

import { Conversation } from "./../entities/Conversation";
import { Arg, Int, Mutation, Query, Resolver } from "type-graphql";
import { InjectManager } from "typeorm-typedi-extensions";
import _ from "lodash";
import { ERol } from "../../../enums/Auth.enums";
@Resolver()
@Service()
export class ChatResolver {
  constructor(
    @InjectManager() private manager: EntityManager,
    private serviceChat: ChatService,
    private userStateService: HandleStateUser,
    private utilChat: ChatUtilsService
  ) {}

  @Mutation((type) => Conversation)
  async createConversation(
    @Arg("idRemitent", (type) => Int) idRemitent: number,
    @Arg("idResponse", (type) => Int) idRecept: number
  ) {
    const [
      resp,
      idConversation,
    ] = await this.serviceChat.existConversationWithUser(idRemitent, idRecept);
    if (resp === true) {
      const respBd = await this.manager.findOne<Conversation>(Conversation, {
        id: idConversation,
      });
      return respBd;
    }
    const conver = await this.manager.create(Conversation).save();
    const adCoverResult = await this.serviceChat.addParticipantInConversation(
      conver.id,
      [idRemitent, idRecept]
    );
    return conver;
  }

  @Query((type) => [RecentMessages])
  async recentMessages(
    @Arg("idUser", (type) => Int, { description: "Conversations from id" })
    idUser: number
  ) {
    // search conversations

    let conversations:
      | number[]
      | { id: number }[] = (await this.manager
      .createQueryBuilder()
      .from(User, "user")
      .select("conversation.id", "id")
      .innerJoin("user.conversations", "conversation")
      .where("user.id = :id", { id: idUser })
      .execute()) as { id: number }[];

    if (conversations) {
      conversations = conversations.map((con) => _.get(con, "id") as number);
      const data = await this.manager.find(RecentMessages, {
        where: {
          id_conversation: In(conversations),
          id_user: Not(Equal(idUser)),
        },
        order: { time_message: "DESC" },
      });
      return data;
    }
    return [];
  }

  @Query((type) => [UserChat])
  async getActiveUser(
    @Arg("idUser", (type) => Int, { description: "Conversations from id" })
    idUser: number
  ): Promise<UserChat[] | null> {
    let users: User[];
    let usersReturn: UserChat[] = [];
    const userBd = await this.manager.findOne<User>(User, { id: idUser });
    if (!userBd) {
      throw new StandarError(19);
    }
    const isUserOnly = userBd.rol.every((el) => el == ERol.USER);

    // rols necesary
    let roles = [];
    if (isUserOnly) {
      // only asesors and admins
      roles = [ERol.ADMIN, ERol.ASESOR];
    } else {
      roles = [ERol.USER];
    }

    users = await this.manager.find(User, {
      where: {
        id: Not(Equal(idUser)),
        // @> Si todos lo valore del array que le doy estan el los valores del array de la bd
        rol: Raw(
          (alias) =>
            `jsonb_path_match(array_to_json(${alias})::jsonb , 'exists($[*] ? (exists(@ ? ($arr[*] == @))))'::jsonpath, :vars::jsonb )`,
          {
            vars: { arr: roles },
          }
        ),
      },
    });
    if (users) {
      usersReturn = [
        ...users.map((user) => this.utilChat.converUserEntity(user)),
      ];
    }

    return usersReturn;
  }
}
