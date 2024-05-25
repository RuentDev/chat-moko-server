import { GraphQLContext } from "../../util/types";
declare const resolvers: {
    Query: {
        conversations: (_: any, __: any, context: GraphQLContext) => Promise<any>;
        getConversation: (_: any, args: {
            conversationId: string;
        }, context: GraphQLContext) => Promise<any>;
    };
    Subscription: {
        convesations: {
            subscribe: (_: any, __: any, context: GraphQLContext) => AsyncIterator<unknown, any, undefined>;
        };
    };
};
export default resolvers;
