import {
  PUB_SUB_INSTANCE,
  TopicsSubscription,
} from "./../../../globals/constants";
import { Conversation } from "./../entities/Conversation";
import { onNewMessagePayload } from "./../model";
import { PubSubEngine, ResolverFilterData } from "type-graphql";
import { EntityManager } from "typeorm";
import { Inject, Service } from "typedi";
import { InjectManager } from "typeorm-typedi-extensions";

@Service()
export class MessageService {
  constructor(
    @InjectManager() private manager: EntityManager,
    @Inject(PUB_SUB_INSTANCE) private pubsub: PubSubEngine
  ) {}

  static filterConversation({
    args,
    payload,
  }: ResolverFilterData<
    onNewMessagePayload,
    { idConversation: number; idUser: number }
  >) {
    return (
      args.idConversation == payload.message.id_conversation &&
      payload.message.id_creator != args.idUser
    );
  }

  async getMembersOfConversation(idUser: number, idConversation: number) {
    let rest = (await this.manager
      .createQueryBuilder()
      .select("participant.id", "id")
      .from(Conversation, "conversation")
      .innerJoin("conversation.participants", "participant")
      .where("conversation.id = :id", { id: idConversation })
      .getRawMany()) as [{ id: number }];
    return rest.map((el) => el.id).filter((el) => el != idUser);
  }
  async emitMemberForNewMessage(idUser: number, idConversation: number) {
    let rest = await this.getMembersOfConversation(idUser, idConversation);
    console.log(rest);
    const emitions = rest.map((el) =>
      this.pubsub.publish(TopicsSubscription.NEW_MESSAGE_ADDED, { id: el })
    );
    Promise.all(emitions).then((el) => {});
  }
}
