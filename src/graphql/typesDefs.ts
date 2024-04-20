
export const typeDefs = `#graphql
	# Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

	scalar Date
	scalar Upload
	scalar File

	type User {
		id: ID!
		email: String!
		phone: String
		first_name: String
		middle_name: String
		last_name: String
		verification_code: String
		is_active: Boolean
		is_reported: Boolean
		is_blocked: Boolean
		createAt: Date
		updatedAt: Date
		role: String
	}

	type Conversation {
		id:  String,
    title: String,
    creatorId: String,
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date,
    participants: [User]
	}
	
	type AuthResponse {
		user: String
		statusText: String
		error: String
	}



	type Message{
		id: ID!
		user: User!
		content: String!
		media: [File]
		files: [File]
		createdAt: Date
		updatedAt: Date

	}

	type ChatResponse {
		error: String
		statusText: String
	}

	# The "Query" type is special: it lists all of the available queries that
	# clients can execute, along with the return type for each. In this
	# case, the "books" query returns an array of zero or more Books (defined above).
	type Query {
		
		login( 
			username: String, 
			password: String
		): AuthResponse


		getAllUserConversation(userId: String): [Conversation]


	}


	type Mutation {


		registerUser(
			email: String,
			phone: String,
			password: String
			firstName: String,
			middleName: String,
			lastName: String,
		): AuthResponse

		sendMessage(
			senderId: String
			recipientId: String
			content: String
			media: [String]
			files: [File]
		): ChatResponse 


	}

	# type Subscription{
	# 	heartBeat(
	# 		visitorsIP:String,
	# 		sku:String,
	# 		browser:String,
	# 		os:String,
	# 		type:String
	# 	): Response
	# }
`;