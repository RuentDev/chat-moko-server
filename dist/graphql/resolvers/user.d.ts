import { PubSub } from "graphql-subscriptions";
import { GraphQLContext } from "../../util/types";
export declare const pubsub: PubSub;
declare const resolvers: {
    Query: {
        searchUsers: (_: any, args: {
            name: string;
        }, context: GraphQLContext) => Promise<{
            users: {
                image: string | null;
                name: string;
                id: string;
                email: string;
            }[];
            error?: undefined;
        } | {
            error: unknown;
            users?: undefined;
        }>;
    };
    Mutation: {
        userLogin: (_: any, args: any, context: GraphQLContext) => Promise<{
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
        createUserAccount: (_: any, args: any, context: GraphQLContext) => Promise<{
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
};
export default resolvers;
