"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_1 = require("apollo-server");
const typeDefs = (0, apollo_server_1.gql) `
  scalar Date
  scalar Upload
  scalar File

  type ConversationParticipant {
    id: String
    hasSeenLatestMessage: Boolean
    userId: String
    conversationId: String
    user: User
  }

  type Conversation {
    id: String
    title: String
    creatorId: String
    createdAt: Date
    updatedAt: Date
    deletedAt: Date
    participants: [ConversationParticipant]
    messages: [Message]
  }

  type Query {
    getConversation(conversationId: String): Conversation
    conversations: [Conversation]
  }

  # type Mutation {}

  type Subscription {
    convesations: [Conversation]
  }
`;
exports.default = typeDefs;
//# sourceMappingURL=conversationTypeDefs.js.map