import { Token } from "typedi";

export const PUB_SUB_INSTANCE = new Token("pubsubinstace");

export const CONFIG_STORE = new Token("configStore");

export const LOGGER = new Token("pino.logger");

// TOPICS SUSCRIPTIONS

export class TopicsSubscription {
  // emit when user disconecct
  static DISCONNECT_USER = "disconectUser";

  static CONNECT_USER = "connectUser";

  static NEW_MESSAGE = "new_message";
  //emitted for refresh recents messages in view
  static NEW_MESSAGE_ADDED = "new_message_added";

  /**
   * This event is emitted when it is required to
   * update  the comment because changues have  been made it
   */
  static CHANGUE_COMMENT = "changue_coment";
}

export const isDev = process.env.NODE_ENV == "development";
