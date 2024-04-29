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
                let conversation = undefined;
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
                conversation = yield prisma.conversation.findFirst({
                    where: {
                        AND: [
                            // { id: args.conversationId },
                            {
                                participants: {
                                    every: {
                                        userId: {
                                            in: [senderId, recipientId]
                                        }
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
                console.log("CONVERSATION", conversation);
                // if (!conversation) {
                // conversation = await prisma.conversation.create({
                //   data: {
                //     creatorId: sender.id
                //   },
                //   include: {
                //     participants: true,
                //     messages: true
                //   }
                // });
                // if (!conversation) {
                //   return {
                //     error: "Failed to create conversation"
                //   }
                // }
                // const conversationParticipants = await prisma.conversationParticipant.createMany({
                //   data: [
                //     {
                //       conversationId: conversation.id,
                //       userId: sender.id,
                //       hasSeenLatestMessage: false,
                //     },
                //     {
                //       conversationId: conversation.id,
                //       userId: recipient.id,
                //       hasSeenLatestMessage: false,
                //     },
                //   ]
                // })
                // if (!conversationParticipants) {
                //   return {
                //     error: "Failed to create conversation participants"
                //   }
                // }
                // const message = await prisma.message.create({
                //   data: {
                //     senderId: sender.id,
                //     content: content,
                //     conversation: {
                //       connect: {
                //         id: conversation.id
                //       }
                //     }
                //   },
                //   include: {
                //     conversation: {
                //       include: {
                //         participants: true
                //       }
                //     }
                //   }
                // })
                // if (!message) {
                //   return {
                //     error: "Failed to send message"
                //   }
                // }
                // pubsub.publish('MESSAGES_SENT', {});
                return {
                    statusText: "Message sent!"
                };
                // }
                // else {
                //   console.log("existing", conversation)
                //   // const message = await prisma.message.create({
                //   //   data: {
                //   //     senderId: sender.id,
                //   //     content: content,
                //   //     conversation: {
                //   //       connect: {
                //   //         id: conversation.id
                //   //       }
                //   //     }
                //   //   },
                //   //   include: {
                //   //     conversation: {
                //   //       include: {
                //   //         participants: true
                //   //       }
                //   //     }
                //   //   }
                //   // })
                //   // if (!message) {
                //   //   return {
                //   //     error: "Failed to send message"
                //   //   }
                //   // }
                //   // pubsub.publish('MESSAGES', { messages: args });
                //   return {
                //     statusText: "Message sent!"
                //   }
                // }
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