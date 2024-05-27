declare const resolvers: {
    Mutation: {
        userLogin: (_: any, args: any, context: import("../../util/types").GraphQLContext) => Promise<{
            token: string;
            statusText: string;
            error?: undefined;
        } | {
            statusText: string;
            token?: undefined;
            error?: undefined;
        } | {
            error: unknown;
            token?: undefined;
            statusText?: undefined;
        }>;
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
            statusText: string;
            error?: undefined;
        } | {
            error: unknown;
            statusText?: undefined;
        }>;
    };
} & {
    Query: {
        conversations: (_: any, __: any, context: import("../../util/types").GraphQLContext) => Promise<import("graphql").GraphQLError | ({
            messages: {
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
            }[];
            participants: ({
                user: {
                    id: string;
                    email: string;
                    name: string;
                    image: string | null;
                    emailVerified: Date | null;
                    phone: string | null;
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
                };
            } & {
                id: string;
                userId: string;
                conversationId: string;
                hasSeenLatestMessage: boolean;
            })[];
        } & {
            id: string;
            title: string | null;
            creatorId: string;
            createdAt: Date;
            updatedAt: Date | null;
            deletedAt: Date | null;
            isPinned: boolean | null;
        })[] | {
            error: unknown;
        }>;
        getConversation: (_: any, args: {
            conversationId: string;
        }, context: import("../../util/types").GraphQLContext) => Promise<import("graphql").GraphQLError | ({
            messages: {
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
            }[];
            participants: ({
                user: {
                    id: string;
                    email: string;
                    name: string;
                    image: string | null;
                    emailVerified: Date | null;
                    phone: string | null;
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
                };
            } & {
                id: string;
                userId: string;
                conversationId: string;
                hasSeenLatestMessage: boolean;
            })[];
        } & {
            id: string;
            title: string | null;
            creatorId: string;
            createdAt: Date;
            updatedAt: Date | null;
            deletedAt: Date | null;
            isPinned: boolean | null;
        }) | {
            error: unknown;
        } | null>;
    };
    Subscription: {
        convesations: {
            subscribe: (_: any, __: any, context: import("../../util/types").GraphQLContext) => AsyncIterator<unknown, any, undefined> | {
                error: unknown;
            };
        };
    };
} & {
    Query: {
        messages: (_: any, args: {
            conversationId: string;
        }, context: import("../../util/types").GraphQLContext) => Promise<import("graphql").GraphQLError | ({
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
