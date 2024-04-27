import { GraphQLContext } from "../../util/types";
declare const resolvers: {
    Query: {
        getConversation: (_: any, args: {
            userId: string;
        }, context: GraphQLContext) => Promise<({
            messages: {
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
            }[];
            participants: {
                id: string;
                email: string;
                phone: string;
                password: string | null;
                first_name: string | null;
                middle_name: string | null;
                last_name: string | null;
                verification_code: string | null;
                is_active: boolean;
                is_reported: boolean;
                is_blocked: boolean;
                createdAt: Date;
                updatedAt: Date | null;
                role: import(".prisma/client").$Enums.Role;
                conversationId: string | null;
            }[];
        } & {
            id: string;
            title: string | null;
            creatorId: string;
            createdAt: Date;
            updatedAt: Date | null;
            deletedAt: Date | null;
            isPinned: boolean | null;
        })[]>;
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
