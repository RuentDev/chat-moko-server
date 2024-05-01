
import { GraphQLContext } from "../../util/types";
import { withFilter } from "graphql-subscriptions";
import { GraphQLError } from "graphql";
import jwt from 'jsonwebtoken'
import bcrypt from "bcrypt";
import { Conversation } from "@prisma/client";


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
        let userConversation: Conversation | null = null


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

        if (conversationId) {
          userConversation = await prisma.conversation.findFirst({
            where: {
              id: conversationId,
              AND: [
                {
                  participants: {
                    some: {
                      userId: sender.id
                    }
                  }
                },
                {
                  participants: {
                    some: {
                      userId: recipient.id
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

          if (!userConversation) {
            return new GraphQLError("Conversation ID was detected but it not existing to database");
          }
        } else {
          userConversation = await prisma.conversation.findFirst({
            where: {
              AND: [
                {
                  participants: {
                    some: {
                      userId: sender.id
                    }
                  }
                },
                {
                  participants: {
                    some: {
                      userId: recipient.id
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
        }

        if (!userConversation) {

          console.log("sent without conversation")
          userConversation = await prisma.conversation.create({
            data: {
              creatorId: sender.id
            },
            include: {
              participants: true,
              messages: true
            }
          });

          if (!userConversation) {
            return {
              error: "Failed to create conversation"
            }
          }

          const conversationParticipants = await prisma.conversationParticipant.createMany({
            data: [
              {
                conversationId: userConversation.id,
                userId: sender.id,
                hasSeenLatestMessage: false,
              },
              {
                conversationId: userConversation.id,
                userId: recipient.id,
                hasSeenLatestMessage: false,
              },
            ]
          })

          if (!conversationParticipants) {
            return {
              error: "Failed to create conversation participants"
            }
          }

          const message = await prisma.message.create({
            data: {
              senderId: sender.id,
              content: content,
              conversation: {
                connect: {
                  id: userConversation.id
                }
              }
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

          return {
            statusText: "Message sent!"
          }
        }

        else {
          console.log("sent with conversation")
          const message = await prisma.message.create({
            data: {
              senderId: sender.id,
              content: content,
              conversationId: userConversation.id
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


          // pubsub.publish('MESSAGES', { messages: args });
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