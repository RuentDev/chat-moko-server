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
        getMessages: (_, args, context) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const { session, prisma, pubsub } = context;
                const { conversationId } = args;
                const messages = yield prisma.message.findMany({
                    where: {
                        conversationId: conversationId
                    }
                });
                return messages;
            }
            catch (error) {
                console.log(error);
                return {
                    error: error
                };
            }
        })
    },
    Mutation: {
        sendMessage: (_, args, context) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const { session, prisma, pubsub } = context;
                const { conversationId, senderId, recipientId, content } = args;
                let userConversation = null;
                // if (!session?.user) {
                //   throw new GraphQLError("Not authorized");
                // }
                const sender = yield prisma.user.findUnique({
                    where: {
                        id: senderId
                    }
                });
                const recipient = yield prisma.user.findUnique({
                    where: {
                        id: recipientId
                    },
                });
                if (!sender || !recipient) {
                    return {
                        error: "Sender or recipient not found",
                    };
                }
                if (conversationId) {
                    userConversation = yield prisma.conversation.findFirst({
                        where: {
                            id: conversationId,
                            AND: [
                                {
                                    participants: {
                                        some: {
                                            userId: sender.id
                                        }
                                    }
                                },
                                {
                                    participants: {
                                        some: {
                                            userId: recipient.id
                                        }
                                    }
                                }
                            ]
                        },
                        include: {
                            participants: true,
                            messages: true
                        }
                    });
                    if (!userConversation) {
                        return new graphql_1.GraphQLError("Conversation ID was detected but it not existing to database");
                    }
                }
                else {
                    userConversation = yield prisma.conversation.findFirst({
                        where: {
                            AND: [
                                {
                                    participants: {
                                        some: {
                                            userId: sender.id
                                        }
                                    }
                                },
                                {
                                    participants: {
                                        some: {
                                            userId: recipient.id
                                        }
                                    }
                                }
                            ]
                        },
                        include: {
                            participants: true,
                            messages: true
                        }
                    });
                }
                if (!userConversation) {
                    console.log("sent without conversation");
                    userConversation = yield prisma.conversation.create({
                        data: {
                            creatorId: sender.id
                        },
                        include: {
                            participants: true,
                            messages: true
                        }
                    });
                    if (!userConversation) {
                        return {
                            error: "Failed to create conversation"
                        };
                    }
                    const conversationParticipants = yield prisma.conversationParticipant.createMany({
                        data: [
                            {
                                conversationId: userConversation.id,
                                userId: sender.id,
                                hasSeenLatestMessage: false,
                            },
                            {
                                conversationId: userConversation.id,
                                userId: recipient.id,
                                hasSeenLatestMessage: false,
                            },
                        ]
                    });
                    if (!conversationParticipants) {
                        return {
                            error: "Failed to create conversation participants"
                        };
                    }
                    const message = yield prisma.message.create({
                        data: {
                            senderId: sender.id,
                            content: content,
                            conversation: {
                                connect: {
                                    id: userConversation.id
                                }
                            }
                        },
                        include: {
                            conversation: {
                                include: {
                                    participants: true
                                }
                            }
                        }
                    });
                    if (!message) {
                        return {
                            error: "Failed to send message"
                        };
                    }
                    return {
                        statusText: "Message sent!"
                    };
                }
                else {
                    console.log("sent with conversation");
                    const message = yield prisma.message.create({
                        data: {
                            senderId: sender.id,
                            content: content,
                            conversationId: userConversation.id
                        },
                        include: {
                            conversation: {
                                include: {
                                    participants: true
                                }
                            }
                        }
                    });
                    if (!message) {
                        return {
                            error: "Failed to send message"
                        };
                    }
                    // pubsub.publish('MESSAGES', { messages: args });
                    return {
                        statusText: "Message sent!"
                    };
                }
            }
            catch (error) {
                console.log(error);
                return {
                    error: error,
                };
            }
        }),
    },
    Subscription: {
        messages: {
            subscribe: (_parent, args, context) => {
                const { pubsub } = context;
                return pubsub.asyncIterator(['MESSAGES_SENT']);
            }
            // subscribe: withFilter(
            //   (_: any, __: any, context: GraphQLContext) => {
            //     const { pubsub } = context;
            //     return pubsub.asyncIterator(["MESSAGE_SENT"]);
            //   },
            //   (
            //     payload: SendMessageSubscriptionPayload,
            //     args: { conversationId: string },
            //     context: GraphQLContext
            //   ) => {
            //     return payload.messageSent.conversationId === args.conversationId;
            //   }
            // ),
        },
    }
};
exports.default = resolvers;
//# sourceMappingURL=message.js.map