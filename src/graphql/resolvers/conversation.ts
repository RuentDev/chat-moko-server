
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