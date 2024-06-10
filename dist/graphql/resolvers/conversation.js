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
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const resolvers = {
    Query: {
        conversations: (_, __, context) => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            try {
                const { session, prisma } = context;
                if (!(session === null || session === void 0 ? void 0 : session.user)) {
                    return new graphql_1.GraphQLError("Not authorized");
                }
                const conversations = yield prisma.conversation.findMany({
                    where: {
                        participants: {
                            some: {
                                userId: (_a = session === null || session === void 0 ? void 0 : session.user) === null || _a === void 0 ? void 0 : _a.id,
                            },
                        },
                    },
                    include: {
                        participants: {
                            include: {
                                user: true,
                            },
                        },
                        messages: {
                            take: 1,
                            orderBy: {
                                createdAt: "desc",
                            },
                        },
                    },
                });
                return conversations;
            }
            catch (error) {
                return {
                    error: error
                };
            }
        }),
        getConversation: (_, args, context) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const { session, prisma } = context;
                if (!(session === null || session === void 0 ? void 0 : session.user)) {
                    return new graphql_1.GraphQLError("Not authorized");
                }
                const conversations = yield prisma.conversation.findUnique({
                    where: {
                        id: args.conversationId,
                    },
                    include: {
                        participants: {
                            include: {
                                user: true,
                            },
                        },
                        messages: {
                            take: 1,
                            orderBy: {
                                createdAt: "desc",
                            },
                        },
                    },
                });
                return conversations;
            }
            catch (error) {
                return {
                    error
                };
            }
        }),
    },
    // Mutation: {},
    Subscription: {
        convesations: {
            subscribe: (_, __, context) => {
                try {
                    const { pubsub } = context;
                    return pubsub.asyncIterator(["CONVERSATION_CREATED"]);
                }
                catch (error) {
                    return {
                        error: error,
                    };
                }
            },
        },
    },
};
exports.default = resolvers;
//# sourceMappingURL=conversation.js.map