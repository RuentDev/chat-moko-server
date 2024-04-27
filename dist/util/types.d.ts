import { PrismaClient } from "@prisma/client";
import { PubSub } from "graphql-subscriptions";
import { Context } from "graphql-ws/lib/server";
/**
 * Server Configuration
 */
export interface Session {
    user?: User;
}
export interface GraphQLContext {
    session: Session | null;
    prisma: PrismaClient;
    pubsub: PubSub;
}
export interface SubscriptionContext extends Context {
    connectionParams: {
        session?: Session;
    };
}
/**
 * Users
 */
export interface User {
    id: string;
    username: string;
}
export interface CreateUsernameResponse {
    success?: boolean;
    error?: string;
}
export interface SearchUsersResponse {
    users: Array<User>;
}
/**
 * Messages
 */
export interface SendMessageArguments {
    id: string;
    conversationId: string;
    senderId: string;
    body: string;
}
/**
 * Conversations
 */
