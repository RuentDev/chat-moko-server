import { gql } from "apollo-server";


const typeDefs = gql`


  scalar Date
  scalar Upload
  scalar File

  type ConversationParticipant{
    id: String
    hasSeenLatestMessage: Boolean
    userId: String
    conversationId: String
    user: User
  }

  type Conversation {
		id:  String,
    title: String,
    creatorId: String,
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date,
    participants: [ConversationParticipant]
    messages: [Message]
	}


  type Query {
    getConversation(userId: String): [Conversation]
  }

  # type Mutation {}


  type Subscription{
    convesations(conversationId: String): [Conversation]
  }

`

export default typeDefs;