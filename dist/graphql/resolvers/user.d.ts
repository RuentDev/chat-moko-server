import { PubSub } from "graphql-subscriptions";
import { GraphQLContext } from "../../util/types";
export declare const pubsub: PubSub;
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
};
export default resolvers;
