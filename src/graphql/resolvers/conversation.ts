import { GraphQLContext } from "../../util/types";
import { withFilter } from "graphql-subscriptions";
import { GraphQLError } from "graphql";

const resolvers = {
  Query: {
    
    conversations: async (_: any, __: any, context: GraphQLContext) => {
      try {
        const { session, prisma } = context;

        // if (!session?.user) {
        //   return new GraphQLError("Not authorized");
        // }

        const conversations = await prisma.conversation.findMany({
          where: {
            participants: {
              some: {
                userId: session?.user?.id,
              },
            },
          },
          include: {
            participants: {
              include: {
                user: true,
              },
            },
            messages: {
              take: 1,
              orderBy: {
                createdAt: "desc",
              },
            },
          },
        });

        return conversations;
      } catch (error) {
        return{
          error: error
        }
      }
    },

    getConversation: async (
      _: any,
      args: { conversationId: string },
      context: GraphQLContext
    ) => {
      try {
        const { session, prisma } = context;

        if (!session?.user) {
          return new GraphQLError("Not authorized");
        }
  
        const conversations = await prisma.conversation.findUnique({
          where: {
            id: args.conversationId,
          },
          include: {
            participants: {
              include: {
                user: true,
              },
            },
            messages: {
              take: 1,
              orderBy: {
                createdAt: "desc",
              },
            },
          },
        });
  
        return conversations;
      } catch (error) {
        return {
          error
        }
      }
    },
  },

  // Mutation: {},

  Subscription: {
    convesations: {
      subscribe: (_: any, __: any, context: GraphQLContext) => {
        try {
          const { pubsub } = context;
          return pubsub.asyncIterator(["CONVERSATION_CREATED"]);
        } catch (error) {
          return {
            error: error,
          }
        }
      },
    },
  },
};

export default resolvers;
