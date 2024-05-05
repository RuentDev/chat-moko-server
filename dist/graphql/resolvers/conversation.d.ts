import { GraphQLContext } from "../../util/types";
declare const resolvers: {
    Query: {
        getConversation: (_: any, args: {
            userId: any;
        }, context: GraphQLContext) => Promise<({
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
            subscribe: (_: any, __: any, context: GraphQLContext) => AsyncIterator<unknown, any, undefined>;
        };
    };
};
export default resolvers;
