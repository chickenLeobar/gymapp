import { HandleStateUser } from "../../../services/user.state";
import { UserViewCtrl } from "../views/userView";
import { FieldResolver, Resolver, ResolverInterface, Root } from "type-graphql";

@Resolver((type) => UserViewCtrl)
export class ResolverCtrlView implements ResolverInterface<UserViewCtrl> {
  constructor(private userService: HandleStateUser) {}
  @FieldResolver()
  async online(@Root() user: UserViewCtrl) {
    return this.userService.isUserOnline(String(user.id));
  }
}
