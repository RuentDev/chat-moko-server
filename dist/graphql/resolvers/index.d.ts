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
        conversations: (_: any, __: any, context: import("../../util/types").GraphQLContext) => Promise<any>;
        getConversation: (_: any, args: {
            conversationId: string;
        }, context: import("../../util/types").GraphQLContext) => Promise<any>;
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
        }, context: import("../../util/types").GraphQLContext) => Promise<any>;
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
