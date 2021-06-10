import { BootstrapComment } from "../entitites/BootrapComment";
import { Mutation, Resolver } from "type-graphql";

@Resolver()
export class BootstrapCommentResolver {
  @Mutation((type) => String)
  async addBootstrapComment() {
    const nodeBootstrap = BootstrapComment.create();
    return String((await nodeBootstrap.save()).id);
  }
}
