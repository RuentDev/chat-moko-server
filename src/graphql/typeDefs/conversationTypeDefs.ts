import { gql } from "apollo-server";

const typeDefs = gql`
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

export default typeDefs;
