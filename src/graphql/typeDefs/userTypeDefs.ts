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
    image: String
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

  # type Query {}

  type Mutation {

		userLogin(username: String, password: String): AuthResponse

    createUserAccount(
      phone: String,
			password: String
			firstName: String,
			middleName: String,
			lastName: String,
    ): AuthResponse


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