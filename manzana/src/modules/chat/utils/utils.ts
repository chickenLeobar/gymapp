import { HandleStateUser } from "./../../../services/user.state";
import { UserChat } from "./../../../types/User";
import { User } from "./../../../entity/User";
import { Service } from "typedi";

@Service()
export class ChatUtilsService {
  constructor(private stateUser: HandleStateUser) {}

  public converUserEntity(user: User): UserChat {
    const userChat = new UserChat();
    userChat.id = user.id;
    userChat.description = user.description;
    userChat.image = user.image;
    userChat.name = user.name;
    userChat.lastName = user.lastName;
    userChat.code = user.code;
    userChat.online = this.stateUser.isUserOnline(String(user.id));
    return userChat;
  }
}
