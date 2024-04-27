import { gql } from "apollo-server";


const typeDefs = gql`


  scalar Date
  scalar Upload
  scalar File

  type ChatResponse {
		error: String
		statusText: String
	}

  enum MessageType {
    SINGLE_CHAT
    GROUP_CHAT
  }

  type Conversation {
		id:  String,
    title: String,
    creatorId: String,
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date,
    participants: [User]
		messages: [Message]
	}

  type Message {
		id: String
		senderId: String
		type: MessageType
		content: String
		attachment_thumb_url: String
		attachment_url: String
		createdAt: Date
		updatedAt: Date
		deletedAt: Date
	}

  type Query {
    getConversation(userId: String): [Conversation]
    getMessages(conversationId: String): [Message]
  }

  type Mutation {
    sendMessage(
			senderId: String
			recipientId: String
			content: String
			media: [String]
			files: [File]
		): ChatResponse 
  }


  type Subscription{
		messages(conversationId: String): Message
	}

`

export default typeDefs;