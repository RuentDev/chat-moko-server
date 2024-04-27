import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { expressMiddleware } from '@apollo/server/express4';
import { resolvers } from './graphql/resolvers.js';
import { useServer } from 'graphql-ws/lib/use/ws';
import { typeDefs } from './graphql/typesDefs.js';
import { ApolloServer } from '@apollo/server';
import { WebSocketServer } from 'ws';
import { config } from 'dotenv';
import express from 'express';
import http from 'http';
import cors from 'cors';
import jwt from 'jsonwebtoken';
config();
async function init() {
    const PORT = 4000;
    const app = express();
    const httpServer = http.createServer(app);
    const schema = makeExecutableSchema({ typeDefs, resolvers });
    const jwt_secret = process.env.JWT_SECRET;
    const wsServer = new WebSocketServer({
        server: httpServer,
        path: '/subscriptions',
    });
    const serverCleanup = useServer({ schema }, wsServer);
    const server = new ApolloServer({
        schema,
        plugins: [
            ApolloServerPluginDrainHttpServer({ httpServer }),
            {
                async serverWillStart() {
                    return {
                        async drainServer() {
                            await serverCleanup.dispose();
                        },
                    };
                },
            },
        ]
    });
    await server.start();
    app.use('/graphql', cors(), express.json(), expressMiddleware(server, {
        context: async ({ req }) => {
            const { authorization } = req.headers;
            if (!authorization && !jwt_secret) {
                return {
                    token: null
                };
            }
            if (typeof authorization === "string" && jwt_secret) {
                const { userID } = jwt.verify(authorization, jwt_secret);
                return { token: userID };
            }
            else {
                return {
                    token: null
                };
            }
        },
    }));
    httpServer.listen(PORT, () => {
        console.log(`Server is now running on http://localhost:${PORT}/graphql`);
    });
}
init();
//# sourceMappingURL=index.js.map