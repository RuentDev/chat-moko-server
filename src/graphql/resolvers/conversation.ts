
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
    getConversation: async (_: any, args: { userId: string }, context: GraphQLContext) => {
      const { session, prisma, pubsub } = context;
      // find all conversation of the user
      const conversations = await prisma.conversation.findMany({
        where: {
          participants: {
            some: {
              id: args.userId
            }
          }
        },
        include: {
          participants: true,
          messages: true,
        }
      })

      return conversations
    },

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
    sendMessage: async (_: any, args: { senderId: string, recipientId: string, content: string }, context: GraphQLContext) => {
      try {

        const { session, prisma, pubsub } = context;
        const { senderId, recipientId, content } = args
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
              {
                participants: {
                  some: {
                    id: senderId
                  }
                }
              },
              {
                participants: {
                  some: {
                    id: recipientId
                  }
                }
              }
            ]
          },
          include: {
            participants: true
          }
        });


        if (!conversation) {

          conversation = await prisma.conversation.create({
            data: {
              creatorId: sender.id, // Replace with the actual creator's user ID
              participants: {
                connect: [{ id: sender.id }, { id: recipient.id }] // Replace with participant user IDs
              }
            },
            include: {
              participants: true
            }
          });

          if (!conversation) {
            return {
              error: "Failed to create conversation"
            }
          }

          const message = await prisma.message.create({
            data: {
              senderId: sender.id,
              content: content,
              conversationId: conversation.id,
            },
            include: {
              conversation: {
                include: {
                  participants: true
                }
              }
            }
          })

          if (!message) {
            return {
              error: "Failed to send message"
            }
          }

          pubsub.publish('MESSAGES_SENT', { messageSent: message });

          return {
            statusText: "Message sent!"
          }
        }

        else {

          const message = await prisma.message.create({
            data: {
              senderId: sender.id,
              content: content,
              conversationId: conversation.id,
            },
            include: {
              conversation: {
                include: {
                  participants: true
                }
              }
            }
          })

          if (!message) {
            return {
              error: "Failed to send message"
            }
          }

          pubsub.publish('MESSAGES', { messages: args });

          return {
            statusText: "Message sent!"
          }
        }

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