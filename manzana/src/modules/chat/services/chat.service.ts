import { Conversation } from "./../entities/Conversation";
import { EntityManager } from "typeorm";
import { Service } from "typedi";
import { InjectManager } from "typeorm-typedi-extensions";
import { isArray } from "lodash";
type ResultExistConversation = {
  idConversation: number;
  coincidence: number;
  total: number;
};
@Service()
export class ChatService {
  constructor(@InjectManager() private manager: EntityManager) {}

  public async addParticipantInConversation(
    converId: number,
    participants: number | number[]
  ) {
    if (isArray(participants)) {
      const promises = participants.map((id) =>
        this.addParticipant(converId, id)
      );
      return await Promise.all(promises);
    }
    return await this.addParticipant(converId, participants);
  }
  private async addParticipant(converId: number, id: number) {
    return this.manager
      .createQueryBuilder()
      .from(Conversation, "conversation")
      .relation("participants")
      .of(converId)
      .add(id);
  }

  public async existConversationWithUser(
    idRemitent: number,
    idResponse: number
  ): Promise<[exist: boolean, idConversation: number]> {
    const coincidences = await this.conicidenceConversationForIds(
      idRemitent,
      idResponse
    );

    const resp = coincidences.find(
      (el) => el.coincidence == 2 && el.total == 2
    );
    if (!resp) {
      return [false, -1];
    }
    return [true, resp.idConversation];
  }
  /**
   *
   * @param idRemitent
   * @param idResponse
   *  Determina las coinicidencias de usuarios en las conversaciones
   *  @returns {idConversation : number , coincidence : number , total : number}[]
   *  la coincidencias es  cuantos ids coinciden de los pasados por parametro con los de la conversacion
   * el total es cuantos usarios hay en esa conversacion
   */
  public async conicidenceConversationForIds(
    idRemitent: number,
    idResponse: number
  ): Promise<ResultExistConversation[]> {
    const resp = await this.manager.query(
      `SELECT
    inter."conversationId" as "idConversation",
    COUNT(*) as "coincidence",
    (SELECT COUNT(*) FROM  public.conversation_participants_user  as inter2 
    GROUP by inter2."conversationId" HAVING inter2."conversationId" = inter."conversationId"  ) as "total"
    FROM public.conversation_participants_user as inter where  inter."userId" in ($1 , $2) 
    group by inter."conversationId"`,
      [idRemitent, idResponse]
    );
    return resp;
  }
}
