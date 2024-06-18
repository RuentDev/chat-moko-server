import { PubSub } from "graphql-subscriptions";
import { GraphQLContext } from "../../util/types";
export declare const pubsub: PubSub;
declare const resolvers: {
    Query: {
        searchConnections: (_: any, { name }: {
            name: string;
        }, context: GraphQLContext) => Promise<{
            data: null;
            error?: undefined;
        } | {
            data: {
                image: string | null;
                name: string;
                id: string;
                email: string;
            }[];
            error?: undefined;
        } | {
            error: unknown;
            data?: undefined;
        }>;
        connections: (_: any, __: any, context: GraphQLContext) => Promise<{
            data: {
                connections: {
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
                    connectionId: string | null;
                }[];
            }[];
            statusText: string;
            error?: undefined;
        } | {
            error: unknown;
            data?: undefined;
            statusText?: undefined;
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
        registerUser: (_: any, args: any, context: GraphQLContext) => Promise<{
            statusText: string;
            error?: undefined;
        } | {
            error: unknown;
            statusText?: undefined;
        }>;
        addConnection: (_: any, args: {
            id: string;
        }, context: GraphQLContext) => Promise<{
            data: {
                connections: {
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
                    connectionId: string | null;
                }[];
            } & {
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
                connectionId: string | null;
            };
            statusText: string;
            error?: undefined;
        } | {
            error: unknown;
            data?: undefined;
            statusText?: undefined;
        }>;
    };
};
export default resolvers;
