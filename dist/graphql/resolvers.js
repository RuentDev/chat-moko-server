import { PubSub } from 'graphql-subscriptions';
import { PrismaClient } from "@prisma/client";
const pubsub = new PubSub();
const prisma = new PrismaClient();
export const resolvers = {
    Query: {
        login: async (_parent, args) => {
            console.log(args);
            return {
                status: 200,
                statusText: "",
            };
        },
        register: async (_parent, args) => {
            return {
                status: 200,
                statusText: "",
            };
        },
        getMessages: async (_parent, args) => {
            const data = await prisma.message.findMany({
                where: {
                    conversationId: args.conversationId
                }
            });
            console.log(data);
            return "test";
        }
    },
    Mutation: {
        postMessage: async (_parent, args) => {
            try {
                let conversation;
                const existingConversation = await prisma.conversation.findUnique({
                    where: {
                        id: args.conversationId
                    }
                });
                if (!existingConversation) {
                    conversation = await prisma.conversation.create({
                        data: {
                            id: args.conversationId,
                        }
                    });
                }
                else {
                    conversation = existingConversation;
                }
                const message = await prisma.message.create({
                    data: {
                        content: args.content,
                        senderId: args.senderId,
                        conversationId: args.conversationId,
                    }
                });
                return {
                    status: 200,
                    statusText: "Sent"
                };
            }
            catch (error) {
                console.error("Error posting message:", error);
                throw new Error("Failed to post message");
            }
        }
    },
};
//# sourceMappingURL=resolvers.js.map