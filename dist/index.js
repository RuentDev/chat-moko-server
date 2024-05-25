"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const drainHttpServer_1 = require("@apollo/server/plugin/drainHttpServer");
const schema_1 = require("@graphql-tools/schema");
const express4_1 = require("@apollo/server/express4");
const ws_1 = require("graphql-ws/lib/use/ws");
const graphql_subscriptions_1 = require("graphql-subscriptions");
const client_1 = require("@prisma/client");
const server_1 = require("@apollo/server");
const resolvers_1 = __importDefault(require("./graphql/resolvers"));
const typeDefs_1 = __importDefault(require("./graphql/typeDefs"));
const ws_2 = require("ws");
const dotenv_1 = require("dotenv");
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const index_1 = require("./util/index");
(0, dotenv_1.config)();
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        const PORT = 4000;
        const app = (0, express_1.default)();
        const httpServer = http_1.default.createServer(app);
        const pubsub = new graphql_subscriptions_1.PubSub();
        const prisma = new client_1.PrismaClient();
        // Creating the WebSocket server
        const wsServer = new ws_2.WebSocketServer({
            // This is the `httpServer` we created in a previous step.
            server: httpServer,
            // Pass a different path here if app.use
            // serves expressMiddleware at a different path
            path: "/graphql",
        });
        const schema = (0, schema_1.makeExecutableSchema)({ typeDefs: typeDefs_1.default, resolvers: resolvers_1.default });
        const getSubscriptionContext = (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx;
            // ctx is the graphql-ws Context where connectionParams live
            if (ctx.connectionParams && ctx.connectionParams.session) {
                const { session } = ctx.connectionParams;
                return { session, prisma, pubsub };
            }
            // Otherwise let our resolvers know we don't have a current user
            return { session: null, prisma, pubsub };
        });
        // Hand in the schema we just created and have the
        // WebSocketServer start listening.
        const serverCleanup = (0, ws_1.useServer)({
            schema,
            context: (ctx) => {
                // This will be run every time the client sends a subscription request
                // Returning an object will add that information to our
                // GraphQL context, which all of our resolvers have access to.
                return getSubscriptionContext(ctx);
            },
        }, wsServer);
        const server = new server_1.ApolloServer({
            schema,
            csrfPrevention: true,
            plugins: [
                // Proper shutdown for the HTTP server.
                (0, drainHttpServer_1.ApolloServerPluginDrainHttpServer)({ httpServer }),
                // Proper shutdown for the WebSocket server.
                {
                    serverWillStart() {
                        return __awaiter(this, void 0, void 0, function* () {
                            return {
                                drainServer() {
                                    return __awaiter(this, void 0, void 0, function* () {
                                        yield serverCleanup.dispose();
                                    });
                                },
                            };
                        });
                    },
                },
            ],
        });
        yield server.start();
        const corsOptions = {
            origin: process.env.BASE_URL,
            credentials: true,
        };
        app.use("/graphql", (0, cors_1.default)(corsOptions), express_1.default.json(), (0, express4_1.expressMiddleware)(server, {
            context: ({ req }) => __awaiter(this, void 0, void 0, function* () {
                const session = yield (0, index_1.getServerSession)(req.headers.cookie);
                return { session: session, prisma, pubsub };
            }),
        }));
        httpServer.listen(PORT, () => {
            console.log(`Server is now running on http://localhost:${PORT}/graphql`);
        });
    });
}
init().catch((err) => console.log(err));
//# sourceMappingURL=index.js.map