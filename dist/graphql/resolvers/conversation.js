"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// export const pubsub = new PubSub()
// const prisma = new PrismaClient();
const jwt_secret = process.env.JWT_SECRET;
const resolvers = {
    Query: {
        getConversation: (_, args, context) => __awaiter(void 0, void 0, void 0, function* () {
            const { session, prisma, pubsub } = context;
            // find all conversation of the user
            const conversations = yield prisma.conversation.findMany({
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
            return conversations;
        }),
    },
    // Mutation: {},
    Subscription: {
        convesations: {
            subscribe: (_, __, context) => {
                const { pubsub } = context;
                console.log("conversation-created");
                return pubsub.asyncIterator(['CONVERSATION_CREATED']);
            }
        }
    }
};
exports.default = resolvers;
//# sourceMappingURL=conversation.js.map