import { Resolver } from "type-graphql";
import { Service } from "typedi";
import ConfigStore from "../../../config/configstore";
@Resolver()
@Service()
export class CreditsResolverConfig {
  constructor() {}
}
