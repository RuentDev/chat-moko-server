import { GraphQLContext } from "../../util/types";
declare const resolvers: {
    Query: {
        getMessages: (_: any, args: {
            conversationId: string;
        }, context: GraphQLContext) => Promise<{
            id: string;
            senderId: string;
            type: import(".prisma/client").$Enums.MessageType;
            content: string;
            attachment_thumb_url: string | null;
            attachment_url: string | null;
            createdAt: Date;
            updatedAt: Date | null;
            deletedAt: Date | null;
            isRead: boolean | null;
            conversationId: string | null;
        }[] | {
            error: unknown;
        }>;
    };
    Mutation: {
        sendMessage: (_: any, args: {
            conversationId: string;
            senderId: string;
            recipientId: string;
            content: string;
        }, context: GraphQLContext) => Promise<{
            statusText: string;
            error?: undefined;
        } | {
            error: unknown;
            statusText?: undefined;
        }>;
    };
    Subscription: {
        messages: {
            subscribe: (_parent: any, args: any, context: GraphQLContext) => AsyncIterator<unknown, any, undefined>;
        };
    };
};
export default resolvers;
