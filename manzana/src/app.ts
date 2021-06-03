import { Icontext, IuserToken } from "./models/context";
import { CreditService } from "./modules/credits/services/credit.service";
import { Defaultload } from "./utils/runDefault";
import { join, resolve } from "path";
import express, { Express, json } from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema, PubSub } from "type-graphql";
import { graphqlUploadExpress } from "graphql-upload";
import { connect as connectTypeOrm } from "./config/typeorm";

import { v2 as cloudinary } from "cloudinary";
import cors from "cors";
import { resolvers } from "graphql-scalars";
import routes from "./routes/index";
import { createServer, Server as ServerHttp } from "http";
import { Container as TypeOrmContainer } from "typeorm-typedi-extensions";
import { useContainer } from "typeorm";
import Logger from "./config/pino";
import { Container } from "typedi";
import { authChecker } from "./utils/autChecker";
import { LOGGER } from "./globals/constants";
useContainer(TypeOrmContainer);
import { CONFIG_STORE, PUB_SUB_INSTANCE } from "./globals/constants";
import { pubsub } from "./config/pubsub.engine";
import jwt from "express-jwt";
import { getToken } from "./utils/getToken";
import configStore from "./config/configstore";
const { SECRETTOKEN } = process.env;
/// middlewares expres
import { handeErrorExpress } from "./utils/token_middleware";
export class Server {
  private app: Express;
  private httpServer: ServerHttp;
  private static _INSTANCE: Server;
  private constructor() {
    this.app = express();
    this.configExpress();
    // setup http server
    this.httpServer = createServer(this.app);
    (async () => {
      await connectTypeOrm();

      await this.initApolloServer();
      // inject pub sub instabce
      Container.set(PUB_SUB_INSTANCE, pubsub);
      Container.set(CONFIG_STORE, configStore);
      Container.set(LOGGER, Logger);
      // Container.set()
      // create user root
      Defaultload.createUserRoot();
      // run defaul configuratiosn
      Defaultload.fillConfigurations();

      // this.storageUpload();
    })().then(() => {});
  }
  public static get getInstance() {
    return this._INSTANCE || (this._INSTANCE = new this());
  }

  /*=============================================
   =            CLOUDINARY CONFIG            =
   =============================================*/
  private configCloudinary() {
    cloudinary.config({
      cloud_name: "wellnesspro",
      api_key: process.env.CLOUDINARYAPIKEY,
      api_secret: process.env.CLOUDINARYAPISECRET,
    });
  }

  private configExpress() {
    this.app.set("PORT", process.env.PORT);
    // middlewares
    // this.app.use(morgan("dev"));
    this.app.use(json());
    // config graphql server
    this.app.use(graphqlUploadExpress({ maxFiles: 10, maxFileSize: 10000000 }));
    this.app.use(express.static(resolve("uploads")));
    const whiteList = ["http://localhost:4200"];
    this.app.use(
      cors({
        origin: "*",
        // origin: function (origin, callback) {
        //   console.log(origin);
        //   if (whiteList.indexOf(String(origin)) !== -1) {
        //     chalk.blue("allow origin", origin);
        //     callback(null, true);
        //   } else {
        //     callback(new Error("no permitido por cors"));
        //   }
        // },
      })
    );
    if (SECRETTOKEN) {
      this.app.use(
        jwt({
          secret: SECRETTOKEN,
          algorithms: ["HS256"],
          getToken: getToken,
          credentialsRequired: false,
        })
      );
      this.app.use(handeErrorExpress);
    } else {
      new Error("Secret Token not provider");
    }
    this.app.use(routes);
  }

  private async initApolloServer() {
    try {
      const server = new ApolloServer({
        subscriptions: {
          path: "/suscriptions",

          onConnect: (params, socket, context) => {
            // console.log("connect");
          },
          onDisconnect: (socket, ctx) => {},
        },
        schema: await buildSchema({
          resolvers: [join(__dirname + "/**/*.{ts,js}")],
          dateScalarMode: "timestamp",
          container: TypeOrmContainer,
          pubSub: pubsub,
          authChecker: authChecker,
        }),
        resolvers: {
          ...resolvers,
        },
        uploads: false,
        context: ({ req, res }) => {
          const context: Icontext = {
            req,
            user: req?.user as IuserToken,
          };
          return context;
        },
        formatError: (err) => {
          Logger.error({ context: "general error", err: err });
          console.log(err);

          return err;
        },
      });

      server.applyMiddleware({ app: this.app, path: "/graphql", cors: true });
      server.installSubscriptionHandlers(this.httpServer);
      const PORT = this.app.get("PORT");
      this.httpServer.listen(PORT, () => {
        Logger.info("Server ready");
        console.log(
          `server ready at http://localhost:${PORT}${server.graphqlPath}`
        );
        console.log(
          `Subscriptions ready at ws://localhost:${PORT}${server.subscriptionsPath}`
        );
      });
    } catch (err) {
      console.log("error", err.message);
    }
  }
}
