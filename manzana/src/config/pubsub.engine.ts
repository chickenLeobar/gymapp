// import { RedisPubSub } from "graphql-redis-subscriptions";
import { PubSub } from "graphql-subscriptions";
// import Redis from "ioredis";
// export const pubsub = new RedisPubSub({
//   subscriber: new Redis(),
//   publisher: new Redis(),
// });

export const pubsub = new PubSub();
