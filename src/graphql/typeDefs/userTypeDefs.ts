import { gql } from "apollo-server";

const typeDefs = gql`


  scalar Date
  scalar Upload
  scalar File

  type AuthResponse {
		user: String
		statusText: String
		error: String
	}

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

  type Query {
    getUsers(email: String): [User]
  
		userLogin(username: String, password: String): AuthResponse
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
  }

`;


export default typeDefs;