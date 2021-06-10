import { StandarError } from "./../../utils/errors/shemaError";
import ConfigStore from "configstore";
import { CONFIG_STORE } from "./../../globals/constants";
import { ConfigResponse } from "./types/model";
import { Service, Inject } from "typedi";
import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { GraphQLJSON } from "graphql-scalars";
@Resolver()
@Service()
export class ConfigResolver {
  constructor(@Inject(CONFIG_STORE) private configStore: ConfigStore) {}

  @Query((type) => ConfigResponse)
  getConfiguration(
    @Arg("path", (type) => String) path: string
  ): ConfigResponse {
    const data = this.configStore.get(path);
    if (!data) {
      throw new StandarError(undefined, "El registro solicitado no existe");
    }
    return {
      path,
      value: data,
    };
  }

  @Mutation((type) => ConfigResponse)
  updateConfiguration(
    @Arg("path") path: string,
    @Arg("value", (type) => GraphQLJSON) value: Object
  ): ConfigResponse {
    const data = this.configStore.get(path);
    if (!data) {
      throw new StandarError(undefined, "EL registro solicitado no existe");
    }
    // indent keys
    this.configStore.set(path, value);
    return {
      path: path,
      value: this.configStore.get(path),
    };
  }
}
