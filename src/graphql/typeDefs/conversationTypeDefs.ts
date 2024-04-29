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
  }

  type Conversation {
		id:  String,
    title: String,
    creatorId: String,
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date,
    participants: [ConversationParticipant]
	}


  type Query {
    getConversation(userId: String): [Conversation]
  }

  # type Mutation {}


  # type Subscription{}

`

export default typeDefs;