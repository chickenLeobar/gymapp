import { User } from "./../entity/User";
import { EntityManager } from "typeorm";
import { TopicsSubscription } from "./../globals/constants";
import { Service, Inject } from "typedi";
import { redis } from "../config/Redis";
import { PUB_SUB_INSTANCE } from "../globals/constants";
const PREFIX = "online";
import { PubSubEngine } from "type-graphql";
const EXP = 10;
const AUDITIME = 200;
import { RedisUtls } from "../utils/redis";
import { interval } from "rxjs";
import { typeOnlineEvent } from "../types/User";
import { InjectManager } from "typeorm-typedi-extensions";
@Service()
export class HandleStateUser {
  private ids: Set<string> = new Set();
  constructor(
    @Inject(PUB_SUB_INSTANCE) private pubsSub: PubSubEngine,
    @InjectManager() private manager: EntityManager
  ) {
    // init serve
    this.vigilateDisconnected();
  }

  vigilateDisconnected() {
    interval(AUDITIME).subscribe((_) => {
      this.emitDisconnectIds();
    });
  }

  async emitConnetedId(id: string) {
    if (!this.ids.has(id)) {
      await this.pubsSub.publish(TopicsSubscription.CONNECT_USER, {
        id: id,
        event: "CONNECT" as typeOnlineEvent,
      });
    }
  }

  private async emitDisconnectIds() {
    const ids = await this.getIdsDisconnect();
    ids.forEach(async (id) => {
      await this.manager.update(User, id, { lastTimeActive: new Date() });
      await this.pubsSub.publish(TopicsSubscription.DISCONNECT_USER, {
        id: id,
        event: "DISCONNECT" as typeOnlineEvent,
      });
    });
  }

  async getIdsDisconnect() {
    const idsInRedis = await this.getOlineIds();
    const redisIds = new Set(idsInRedis);

    const disconnectIds = new Set(Array.from(this.ids));
    for (const item of redisIds) {
      disconnectIds.delete(item);
    }
    // update ids
    this.ids = redisIds;
    return Array.from(disconnectIds);
  }

  // establecer estado online }
  async stablishOnline(
    id: string,
    data?: Object | string,
    derivation?: string
  ) {
    await this.emitConnetedId(id);
    this.ids.add(id);
    await redis.set(
      this.prefix(derivation) + id,
      JSON.stringify(data),
      "ex",
      EXP
    );
  }
  private prefix(derivation?: string) {
    return derivation ? `${PREFIX}${derivation}:` : PREFIX + ":";
  }

  async getOlineIds(derivation?: string): Promise<string[]> {
    return RedisUtls.getListDataToPrefix(this.prefix(derivation));
  }
  isUserOnline(id: string) {
    return this.ids.has(id);
  }
  async existUserOnline(id: string, derivation?: string) {
    if (await redis.get(this.prefix(PREFIX) + id)) {
      return true;
    } else {
      return false;
    }
  }
}
