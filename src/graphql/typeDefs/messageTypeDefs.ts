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

  type Message {
		id: String
		senderId: String
		user: User
		type: MessageType
		content: String
		attachment_thumb_url: String
		attachment_url: String
		createdAt: Date
		updatedAt: Date
		deletedAt: Date
		conversationId: String
	}

  type Query {
    messages(conversationId: String): [Message]
  }

  type Mutation {
    sendMessage(
			conversationId: String,
			senderId: String
			recipientId: String
			content: String
			media: [String]
			files: [File]
		): ChatResponse 
  }


  type Subscription{
		messageSent: Message
	}

`

export default typeDefs;