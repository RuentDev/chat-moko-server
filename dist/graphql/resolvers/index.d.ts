declare const resolvers: {
    Mutation: {
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
        createUserAccount: (_: any, args: any, context: import("../../util/types").GraphQLContext) => Promise<{
            user: undefined;
            statusText: string;
            error?: undefined;
        } | {
            user: string;
            statusText: string;
            error?: undefined;
        } | {
            error: unknown;
            user?: undefined;
            statusText?: undefined;
        }>;
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
            user?: undefined;
            statusText?: undefined;
        }>;
    };
} & {
    Query: {
        getConversation: (_: any, args: {
            userId: any;
        }, context: import("../../util/types").GraphQLContext) => Promise<({
            participants: ({
                user: {
                    id: string;
                    email: string;
                    phone: string | null;
                    password: string | null;
                    first_name: string | null;
                    middle_name: string | null;
                    last_name: string | null;
                    image: string | null;
                    emailVerified: Date | null;
                    verification_code: string | null;
                    is_active: boolean;
                    is_reported: boolean;
                    is_blocked: boolean;
                    createdAt: Date;
                    updatedAt: Date | null;
                    role: import(".prisma/client").$Enums.Role;
                };
            } & {
                id: string;
                userId: string;
                conversationId: string;
                hasSeenLatestMessage: boolean;
            })[];
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
    Subscription: {
        convesations: {
            subscribe: (_: any, __: any, context: import("../../util/types").GraphQLContext) => AsyncIterator<unknown, any, undefined>;
        };
    };
} & {
    Query: {
        messages: (_: any, args: {
            conversationId: string;
        }, context: import("../../util/types").GraphQLContext) => Promise<import("graphql").GraphQLError | ({
            user: {
                id: string;
                email: string;
                phone: string | null;
                password: string | null;
                first_name: string | null;
                middle_name: string | null;
                last_name: string | null;
                image: string | null;
                emailVerified: Date | null;
                verification_code: string | null;
                is_active: boolean;
                is_reported: boolean;
                is_blocked: boolean;
                createdAt: Date;
                updatedAt: Date | null;
                role: import(".prisma/client").$Enums.Role;
            };
        } & {
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
        })[] | {
            error: unknown;
        }>;
    };
    Mutation: {
        sendMessage: (_: any, args: {
            conversationId: string;
            senderId: string;
            recipientId: string;
            content: string;
        }, context: import("../../util/types").GraphQLContext) => Promise<import("graphql").GraphQLError | {
            statusText: string;
            error?: undefined;
        } | {
            error: unknown;
            statusText?: undefined;
        }>;
    };
    Subscription: {
        messageSent: {
            subscribe: (_: any, __: any, context: import("../../util/types").GraphQLContext) => AsyncIterator<unknown, any, undefined>;
        };
    };
};
export default resolvers;
