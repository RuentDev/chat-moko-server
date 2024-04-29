"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_1 = require("apollo-server");
const typeDefs = (0, apollo_server_1.gql) `


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
		type: MessageType
		content: String
		attachment_thumb_url: String
		attachment_url: String
		createdAt: Date
		updatedAt: Date
		deletedAt: Date
	}

  type Query {
    getMessages(conversationId: String): [Message]
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
		messages(conversationId: String): [Message]
	}

`;
exports.default = typeDefs;
//# sourceMappingURL=messageTypeDefs.js.map