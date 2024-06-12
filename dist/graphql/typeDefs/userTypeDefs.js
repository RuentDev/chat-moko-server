"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_1 = require("apollo-server");
const typeDefs = (0, apollo_server_1.gql) `
  scalar Date
  scalar Upload
  scalar File
  scalar Data

  type Response {
    token: String
    statusText: String
    error: String
    data: Data
  }

  type SearchedUser{
    id: ID
    name: String
    email: String
    image: String
  }

  type SearchedUsersResponse {
    error: String
    data: [SearchedUser]
  }

  type User {
    id: ID
    email: String
    name: String
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
    connections: [Friend]
  }

  type Friend {
    id: ID
    email: String
    name: String
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

  type Query {
    connections: Response
    searchConnections(name: String): SearchedUsersResponse
  }

  type Mutation {
    userLogin(email: String, password: String): Response
    addConnection(id: String): Response

    createUserAccount(
      phone: String
      password: String
      firstName: String
      middleName: String
      lastName: String
    ): Response

    registerUser(
      email: String
      phone: String
      password: String
      firstName: String
      middleName: String
      lastName: String
    ): Response
  }
`;
exports.default = typeDefs;
//# sourceMappingURL=userTypeDefs.js.map