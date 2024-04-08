
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
		fname: String!
		lname: String!
		email: String!
		username: String
		contact: Int
		password: String!
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


	type Response {
		statusText: String
		status: Int
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
		): Response

		register(
			fName: String,
			lName: String,
			email: String,
			username: String,
			password: String
		): Response

		getMessages(
			conversationId: String
		): String


	}


	type Mutation {

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