
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { GraphQLContext, Session, SubscriptionContext } from "./util/types";
import {  ApolloServerPluginLandingPageLocalDefault, ApolloServerPluginLandingPageProductionDefault,} from '@apollo/server/plugin/landingPage/default'
import { makeExecutableSchema } from "@graphql-tools/schema";
import { expressMiddleware } from "@apollo/server/express4";
import { useServer } from "graphql-ws/lib/use/ws";
import { PubSub } from "graphql-subscriptions";
import { PrismaClient } from "@prisma/client";
import { ApolloServer } from "@apollo/server";
import resolvers from "./graphql/resolvers";
import typeDefs from "./graphql/typeDefs";
import { WebSocketServer } from "ws";
import { config } from "dotenv";
import express from "express";
import http from "http";
import cors from "cors";
import { getServerSession } from "./util/index";

config();
async function init() {

  const PORT = 4000;
  const app = express();
  const httpServer = http.createServer(app);

  const pubsub = new PubSub();
  const prisma = new PrismaClient();

  // Creating the WebSocket server
  const wsServer = new WebSocketServer({
    // This is the `httpServer` we created in a previous step.
    server: httpServer,
    // Pass a different path here if app.use
    // serves expressMiddleware at a different path
    path: "/graphql",
  });

  const schema = makeExecutableSchema({ typeDefs, resolvers });

  const getSubscriptionContext = async (
    ctx: SubscriptionContext
  ): Promise<GraphQLContext> => {
    ctx;
    // ctx is the graphql-ws Context where connectionParams live
    if (ctx.connectionParams && ctx.connectionParams.session) {
      const { session } = ctx.connectionParams;
      return { session, prisma, pubsub };
    }
    // Otherwise let our resolvers know we don't have a current user
    return { session: null, prisma, pubsub };
  };

  // Hand in the schema we just created and have the
  // WebSocketServer start listening.
  const serverCleanup = useServer(
    {
      schema,
      context: (ctx: SubscriptionContext) => {
        // This will be run every time the client sends a subscription request
        // Returning an object will add that information to our
        // GraphQL context, which all of our resolvers have access to.
        return getSubscriptionContext(ctx);
      },
    },
    wsServer
  );

  const server = new ApolloServer({
    schema,
    csrfPrevention: true,
    introspection: true,
    cache: "bounded",
    plugins: [
      ApolloServerPluginLandingPageProductionDefault({ 
        embed: true, 
        graphRef: process.env.GRAPH_REF as string
      }),
      
      // Proper shutdown for the HTTP server.
      ApolloServerPluginDrainHttpServer({ httpServer }),
      // Proper shutdown for the WebSocket server.
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  });

  await server.start();

  const corsOptions = {
    origin: [
      process.env.BASE_URL as string,
      process.env.ALLOWED_ORIGIN1 as string,
      process.env.ALLOWED_ORIGIN2 as string,
    ],
    credentials: true,
  };

  app.use(
    "/graphql",
    cors<cors.CorsRequest>(corsOptions),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req, res }): Promise<GraphQLContext> => {
        console.log("CHEKING FOR REQUES HEADER COOKIE");
        console.log(req.headers);
        if(req.headers.origin && req.headers.cookie) {
          const session = await getServerSession(req.headers.origin, req.headers.cookie);
          console.log("WITH ORIGIN AND COOKIE");
          return { session: session as Session, prisma, pubsub };
        }else{
          return { session: null, prisma, pubsub };
        }
      },
    })
  );


  httpServer.listen(PORT, () => {
    console.log(`Server is now running on http://localhost:${PORT}/graphql`);
  });
}

init().catch((err) => console.log(err));

