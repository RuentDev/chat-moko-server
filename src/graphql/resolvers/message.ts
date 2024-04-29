
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
    getMessages: async (_: any, args: { conversationId: string }, context: GraphQLContext) => {
      try {
        const { session, prisma, pubsub } = context;
        const { conversationId } = args

        const messages = await prisma.message.findMany({
          where: {
            conversationId: conversationId
          }
        })


        return messages

      } catch (error) {
        console.log(error)
        return {
          error: error
        }
      }
    }
  },

  Mutation: {
    sendMessage: async (_: any, args: { conversationId: string, senderId: string, recipientId: string, content: string }, context: GraphQLContext) => {
      try {

        const { session, prisma, pubsub } = context;
        const { conversationId, senderId, recipientId, content } = args
        let conversation = undefined


        // if (!session?.user) {
        //   throw new GraphQLError("Not authorized");
        // }


        const sender = await prisma.user.findUnique({
          where: {
            id: senderId
          }
        });

        const recipient = await prisma.user.findUnique({
          where: {
            id: recipientId
          },
        });

        if (!sender || !recipient) {
          return {
            error: "Sender or recipient not found",
          }
        }

        conversation = await prisma.conversation.findFirst({
          where: {
            AND: [
              // { id: args.conversationId },
              {
                participants: {
                  every: {
                    userId: {
                      in: [senderId, recipientId]
                    }
                  }
                }
              }
            ]
          },
          include: {
            participants: true,
            messages: true
          }
        });


        console.log("CONVERSATION", conversation)

        // if (!conversation) {


        // conversation = await prisma.conversation.create({
        //   data: {
        //     creatorId: sender.id
        //   },
        //   include: {
        //     participants: true,
        //     messages: true
        //   }
        // });

        // if (!conversation) {
        //   return {
        //     error: "Failed to create conversation"
        //   }
        // }

        // const conversationParticipants = await prisma.conversationParticipant.createMany({
        //   data: [
        //     {
        //       conversationId: conversation.id,
        //       userId: sender.id,
        //       hasSeenLatestMessage: false,
        //     },
        //     {
        //       conversationId: conversation.id,
        //       userId: recipient.id,
        //       hasSeenLatestMessage: false,
        //     },
        //   ]
        // })

        // if (!conversationParticipants) {
        //   return {
        //     error: "Failed to create conversation participants"
        //   }
        // }

        // const message = await prisma.message.create({
        //   data: {
        //     senderId: sender.id,
        //     content: content,
        //     conversation: {
        //       connect: {
        //         id: conversation.id
        //       }
        //     }
        //   },
        //   include: {
        //     conversation: {
        //       include: {
        //         participants: true
        //       }
        //     }
        //   }
        // })

        // if (!message) {
        //   return {
        //     error: "Failed to send message"
        //   }
        // }


        // pubsub.publish('MESSAGES_SENT', {});

        return {
          statusText: "Message sent!"
        }
        // }

        // else {
        //   console.log("existing", conversation)
        //   // const message = await prisma.message.create({
        //   //   data: {
        //   //     senderId: sender.id,
        //   //     content: content,
        //   //     conversation: {
        //   //       connect: {
        //   //         id: conversation.id
        //   //       }
        //   //     }
        //   //   },
        //   //   include: {
        //   //     conversation: {
        //   //       include: {
        //   //         participants: true
        //   //       }
        //   //     }
        //   //   }
        //   // })

        //   // if (!message) {
        //   //   return {
        //   //     error: "Failed to send message"
        //   //   }
        //   // }

        //   // pubsub.publish('MESSAGES', { messages: args });

        //   return {
        //     statusText: "Message sent!"
        //   }
        // }

      } catch (error) {
        console.log(error)
        return {
          error: error,
        }
      }
    },
  },


  Subscription: {
    messages: {
      subscribe: (_parent: any, args: any, context: GraphQLContext) => {
        const { pubsub } = context

        return pubsub.asyncIterator(['MESSAGES_SENT'])
      }
      // subscribe: withFilter(
      //   (_: any, __: any, context: GraphQLContext) => {
      //     const { pubsub } = context;

      //     return pubsub.asyncIterator(["MESSAGE_SENT"]);
      //   },
      //   (
      //     payload: SendMessageSubscriptionPayload,
      //     args: { conversationId: string },
      //     context: GraphQLContext
      //   ) => {
      //     return payload.messageSent.conversationId === args.conversationId;
      //   }
      // ),
    },
  }


}



export default resolvers;