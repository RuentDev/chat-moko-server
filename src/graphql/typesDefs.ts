
export const typeDefs = `#graphql
	# Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

	scalar Date
	scalar Upload
	scalar File


	input Sender{
		fname: String
		lname: String
	}

	type User {
		id: ID!
		first_name: String!
		last_name: String!
		middle_name: String!
		email: String!
		phone: Int
		password: String!
		verification_code: String
		is_active: Boolean
		is_blocked: Boolean
		createAt: Date
		updatedAt: Date
		participantsId: Int
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
		status: Int
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


		getMessages(
			conversationId: String
		): String


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

		postMessage(
			content: String,
			senderId: String,
			conversationId: String
			sender: Sender
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