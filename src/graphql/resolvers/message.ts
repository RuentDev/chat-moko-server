import { GraphQLContext } from "../../util/types";
import { withFilter } from "graphql-subscriptions";
import { GraphQLError } from "graphql";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Conversation } from "@prisma/client";

// export const pubsub = new PubSub()
// const prisma = new PrismaClient();
const jwt_secret = process.env.JWT_SECRET;

const resolvers = {
  Query: {
    messages: async (
      _: any,
      args: { conversationId: string },
      context: GraphQLContext
    ) => {
      try {
        const { session, prisma } = context;
        const { conversationId } = args;

        if (!session?.user) {
          return new GraphQLError("Not authorized");
        }

        const messages = await prisma.message.findMany({
          where: {
            conversationId: conversationId,
          },
          take: 50,
          orderBy: {
            createdAt: "desc",
          },
          include: {
            user: {
              select: {
                name: true,
                first_name: true,
                middle_name: true,
                last_name: true,
              },
            },
          },
        });

        return messages;
      } catch (error) {
        return {
          error: error,
        };
      }
    },
  },

  Mutation: {
    sendMessage: async (
      _: any,
      args: {
        conversationId: string;
        senderId: string;
        participants: string[];
        content: string;
      },
      context: GraphQLContext
    ) => {
      try {
        const { session, prisma, pubsub } = context;
        let { conversationId, senderId, participants, content } = args;
        let userConversation: Conversation | null = null;

        if (!session?.user) {
          throw new GraphQLError("Not authorized");
        }

        /*
          check all participants if exising in the user table
        */
        const useParticipants = await prisma.user.findMany({
          where: {
            id: {
              in: participants,
            },
          },
        });

        if (useParticipants.length !== participants.length) {
          return {
            error: "Conversation participants not found",
          };
        }

        if (conversationId) {
          /*
            check all convesation where conversation id exist
          */
          userConversation = await prisma.conversation.findFirst({
            where: {
              id: conversationId,
            },
            include: {
              participants: true,
              messages: true,
            },
          });

          if (!userConversation) {
            return new GraphQLError(
              "Conversation ID was detected but it not existing to database"
            );
          }
        } else {
          /*
            check all convesation where participant id exist
          */
          userConversation = await prisma.conversation.findFirst({
            where: {
              participants: {
                every: {
                  userId: {
                    in: [...participants],
                  },
                },
              },
            },
            include: {
              participants: true,
            },
          });
        }

        if (!userConversation) {
          /*
            create conversation if not existing
          */
          userConversation = await prisma.conversation.create({
            data: {
              creatorId: session.user.id,
            },
            include: {
              participants: true,
            },
          });

          if (!userConversation) {
            return {
              error: "Failed to create conversation",
            };
          }

          const _participants: {
            conversationId: string;
            userId: string;
            hasSeenLatestMessage: boolean;
          }[] = [];

          participants.forEach((id: string) => {
            if (userConversation) {
              _participants.push({
                conversationId: userConversation.id,
                userId: id,
                hasSeenLatestMessage: false,
              });
            }
          });

          /*
            CREATE ALL PARTICIPANTS
          */
          const conversationParticipants =
            await prisma.conversationParticipant.createMany({
              data: _participants,
            });

          if (!conversationParticipants) {
            return {
              error: "Failed to create conversation participants",
            };
          }

          const message = await prisma.message.create({
            data: {
              senderId: session.user.id,
              content: content,
              conversationId: userConversation.id,
            },
            include: {
              user: true,
            },
          });

          if (!message) {
            return {
              error: "Failed to send message",
            };
          }

          pubsub.publish("CONVERSATION_CREATED", {
            conversation: userConversation,
          });

          pubsub.publish("MESSAGE_SENT", {
            messageSent: message,
          });

          return {
            statusText: "Message sent!",
          };
        } else {
          const message = await prisma.message.create({
            data: {
              senderId: session.user.id,
              content: content,
              conversationId: userConversation.id,
            },
            include: {
              user: true,
            },
          });

          if (!message) {
            return {
              error: "Failed to send message",
            };
          }

          pubsub.publish("MESSAGE_SENT", {
            messageSent: message,
          });

          return {
            statusText: "Message sent!",
          };
        }
      } catch (error) {
        return {
          error: error,
        };
      }
    },
  },

  Subscription: {
    messageSent: {
      subscribe: (_: any, __: any, context: GraphQLContext) => {
        const { pubsub } = context;
        return pubsub.asyncIterator(["MESSAGE_SENT"]);
      },
    },
  },
};

export default resolvers;
