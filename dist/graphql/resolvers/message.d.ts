import { GraphQLContext } from "../../util/types";
import { GraphQLError } from "graphql";
declare const resolvers: {
    Query: {
        messages: (_: any, args: {
            conversationId: string;
        }, context: GraphQLContext) => Promise<GraphQLError | ({
            user: {
                name: string;
                first_name: string | null;
                middle_name: string | null;
                last_name: string | null;
            } | null;
        } & {
            id: string;
            type: import(".prisma/client").$Enums.MessageType;
            content: string;
            attachment_thumb_url: string | null;
            attachment_url: string | null;
            createdAt: Date;
            updatedAt: Date | null;
            deletedAt: Date | null;
            isRead: boolean | null;
            conversationId: string | null;
            senderId: string;
        })[] | {
            error: unknown;
        }>;
    };
    Mutation: {
        sendMessage: (_: any, args: {
            conversationId: string;
            senderId: string;
            participants: string[];
            content: string;
        }, context: GraphQLContext) => Promise<GraphQLError | {
            statusText: string;
            error?: undefined;
        } | {
            error: unknown;
            statusText?: undefined;
        }>;
    };
    Subscription: {
        messageSent: {
            subscribe: (_: any, __: any, context: GraphQLContext) => AsyncIterator<unknown, any, undefined>;
        };
    };
};
export default resolvers;
