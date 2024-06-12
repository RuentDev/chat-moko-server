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
// export const pubsub = new PubSub()
// const prisma = new PrismaClient();
const jwt_secret = process.env.JWT_SECRET;
const resolvers = {
    Query: {
        messages: (_, args, context) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const { session, prisma } = context;
                const { conversationId } = args;
                if (!(session === null || session === void 0 ? void 0 : session.user)) {
                    return new graphql_1.GraphQLError("Not authorized");
                }
                const messages = yield prisma.message.findMany({
                    where: {
                        conversationId: conversationId,
                    },
                    take: 50,
                    orderBy: {
                        createdAt: "desc",
                    },
                    include: {
                        user: {
                            select: {
                                name: true,
                                first_name: true,
                                middle_name: true,
                                last_name: true,
                            },
                        },
                    },
                });
                return messages;
            }
            catch (error) {
                return {
                    error: error,
                };
            }
        }),
    },
    Mutation: {
        sendMessage: (_, args, context) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const { session, prisma, pubsub } = context;
                let { conversationId, senderId, participants, content } = args;
                let userConversation = null;
                if (!(session === null || session === void 0 ? void 0 : session.user)) {
                    throw new graphql_1.GraphQLError("Not authorized");
                }
                // IF CONVERSATION ID IS NOT DETECTED
                if (!conversationId) {
                    /* create conversation if not existing */
                    userConversation = yield prisma.conversation.create({
                        data: {
                            creatorId: session.user.id,
                            participants: {
                                connect: participants.map((id) => ({ id })),
                            }
                        }
                    });
                    if (!userConversation) {
                        return {
                            error: "Failed to create conversation",
                        };
                    }
                    const message = yield prisma.message.create({
                        data: {
                            senderId: session.user.id,
                            content: content,
                            conversationId: userConversation.id,
                        }
                    });
                    if (!message) {
                        return {
                            error: "Failed to send message",
                        };
                    }
                    pubsub.publish("CONVERSATION_CREATED", {
                        conversation: userConversation,
                    });
                    pubsub.publish("MESSAGE_SENT", {
                        messageSent: message,
                    });
                    return {
                        statusText: "Message sent!",
                    };
                }
                /*
                  check all convesation where conversation id exist
                */
                userConversation = yield prisma.conversation.findFirst({
                    where: {
                        id: conversationId,
                    }
                });
                if (!userConversation) {
                    return new graphql_1.GraphQLError("Conversation ID was detected but it not existing to database");
                }
                const message = yield prisma.message.create({
                    data: {
                        conversationId: userConversation.id,
                        senderId: session.user.id,
                        content: content,
                    }
                });
                if (!message) {
                    return {
                        error: "Failed to send message",
                    };
                }
                pubsub.publish("MESSAGE_SENT", {
                    messageSent: message,
                });
                return {
                    statusText: "Message sent!",
                };
            }
            catch (error) {
                return {
                    error: error,
                };
            }
        }),
    },
    Subscription: {
        messageSent: {
            subscribe: (_, __, context) => {
                const { pubsub } = context;
                return pubsub.asyncIterator(["MESSAGE_SENT"]);
            },
        },
    },
};
exports.default = resolvers;
//# sourceMappingURL=message.js.map