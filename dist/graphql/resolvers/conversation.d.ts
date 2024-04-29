import { GraphQLContext } from "../../util/types";
declare const resolvers: {
    Query: {
        getConversation: (_: any, args: {
            userId: any;
        }, context: GraphQLContext) => Promise<({
            participants: {
                id: string;
                userId: string;
                conversationId: string;
                hasSeenLatestMessage: boolean;
            }[];
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
};
export default resolvers;
