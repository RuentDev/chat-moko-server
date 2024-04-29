declare const resolvers: {
    Query: {
        userLogin: (_: any, args: any) => Promise<{
            error: string;
            user?: undefined;
            statusText?: undefined;
        } | {
            user: undefined;
            statusText: string;
            error?: undefined;
        } | {
            user: string;
            statusText: string;
            error?: undefined;
        } | {
            error: unknown;
            user: undefined;
            statusText?: undefined;
        } | undefined>;
    };
    Mutation: {
        registerUser: (_: any, args: any) => Promise<{
            user: undefined;
            statusText: string;
            error?: undefined;
        } | {
            user: string;
            statusText: string;
            error?: undefined;
        } | {
            error: unknown;
            user: undefined;
            statusText?: undefined;
        }>;
    };
} & {
    Query: {
        getConversation: (_: any, args: {
            userId: any;
        }, context: import("../../util/types").GraphQLContext) => Promise<({
            participants: {
                id: string;
                userId: string;
                conversationId: string;
                hasSeenLatestMessage: boolean;
            }[];
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
        } & {
            id: string;
            title: string | null;
            creatorId: string;
            createdAt: Date;
            updatedAt: Date | null;
            deletedAt: Date | null;
            isPinned: boolean | null;
        })[]>;
    };
} & {
    Query: {
        getMessages: (_: any, args: {
            conversationId: string;
        }, context: import("../../util/types").GraphQLContext) => Promise<{
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
        }, context: import("../../util/types").GraphQLContext) => Promise<{
            statusText: string;
            error?: undefined;
        } | {
            error: unknown;
            statusText?: undefined;
        }>;
    };
    Subscription: {
        messages: {
            subscribe: (_parent: any, args: any, context: import("../../util/types").GraphQLContext) => AsyncIterator<unknown, any, undefined>;
        };
    };
};
export default resolvers;
