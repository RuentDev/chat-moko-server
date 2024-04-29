
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
              // conversationId: {
              //   in: [
              //     // Subquery to find conversations where user are participants
              //     // Get conversation IDs where sender is a participant
              //     ...(await prisma.conversationParticipant.findMany({
              //       where: {
              //         conversation: {
              //           participants: {
              //             some: {
              //               conversationId: { in: [args.userId] },
              //             }
              //           }
              //         }
              //       },
              //       select: { conversationId: true }
              //     })).map(participant => participant.conversationId)
              //   ]
              // }
            }
          }
        },
        include: {
          participants: true,
          messages: true
        }
      });

      return conversations
    },
  },

  // Mutation: {},

  // Subscription: {}
}



export default resolvers;