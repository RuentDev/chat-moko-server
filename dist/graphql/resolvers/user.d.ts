import { PubSub } from "graphql-subscriptions";
export declare const pubsub: PubSub;
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
};
export default resolvers;
