
import { GraphQLContext } from "../../util/types";
import { withFilter } from "graphql-subscriptions";
import { GraphQLError } from "graphql";
import jwt from 'jsonwebtoken'
import bcrypt from "bcrypt";


// export const pubsub = new PubSub()
// const prisma = new PrismaClient();
const jwt_secret = process.env.JWT_SECRET


const resolvers = {


  Query: {
    getConversation: async (_: any, args: { userId: any }, context: GraphQLContext) => {
      const { session, prisma, pubsub } = context;
      // find all conversation of the user
      const conversations = await prisma.conversation.findMany({
        where: {
          participants: {
            some: {
              userId: args.userId,
            }
          }
        },
        include: {
          participants: {
            include: {
              user: true
            }
          },
          messages: {
            take: 1,
            orderBy: {
              createdAt: 'desc'
            }
          }
        }
      });

      return conversations
    },
  },

  // Mutation: {},

  Subscription: {
     convesations: {
      subscribe: (_: any, __: any, context: GraphQLContext) => {
        const { pubsub } = context
        console.log("conversation-created")
        return pubsub.asyncIterator(['CONVERSATION_CREATED'])
      }
    }
  }
}



export default resolvers;