import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken'
import { PubSub } from 'graphql-subscriptions';
import { PrismaClient } from "@prisma/client";
import { subscribe } from "diagnostics_channel";
import { error } from "console";
import { config } from 'dotenv';


config();

const pubsub = new PubSub();
const prisma = new PrismaClient();

const jwt_secret = process.env.JWT_SECRET

export const resolvers = {
	Query: {

		login: async (_parent: any, args: any) => {
			try {


				if (!jwt_secret) return {
					user: undefined,
					statusText: "Please set JWT_SECRET in .env file"
				}


				const { username, password } = args

				const userEmailExist = await prisma.user.findUnique({
					where: {
						email: username
					}
				})

				if (userEmailExist) {
					const { password: encodedPassword } = userEmailExist
					if (encodedPassword) {

						const compareRes = await bcrypt.compare(password, encodedPassword)

						if (!compareRes) {
							return {
								user: undefined,
								statusText: "Ivalid username or password!"
							}
						}




						const token = jwt.sign({
							user: {
								email: userEmailExist.email,
								phone: userEmailExist.phone,
								first_name: userEmailExist.first_name,
								middle_name: userEmailExist.middle_name,
								last_name: userEmailExist.last_name,
								is_active: userEmailExist.is_active,
								is_blocked: userEmailExist.is_blocked,
								createAt: userEmailExist.createdAt,
								updatedAt: userEmailExist.updatedAt,
								participantsId: userEmailExist.participantsId,
							}
						}, jwt_secret, { algorithm: 'RS256', expiresIn: '30d' })


						return {
							user: token,
							statusText: "Login Success!"
						}

					}


				} else {
					return {
						user: undefined,
						statusText: "User not registered!"
					}
				}

			} catch (error) {
				return {
					error: error,
					user: undefined
				}
			}
		},

		getMessages: async (_parent: any, args: any) => {

			const data = await prisma.conversation.findMany()
			console.log(data)
			return "test"
		}

	},

	Mutation: {
		registerUser: async (parent: any, args: any) => {
			try {


				if (!jwt_secret) return {
					user: undefined,
					statusText: "Please set JWT_SECRET in .env file"
				}

				const { email, phone, password, firstName, middleName, lastName } = args

				const userExist = await prisma.user.findUnique({
					where: {
						email: email
					}
				})

				if (userExist) {
					return {
						user: undefined,
						statusText: "This user are already registered! Please use another email"
					}
				}

				const saltRounds = 10

				const salt = bcrypt.genSaltSync(saltRounds);
				const hashPass = bcrypt.hashSync(password, salt)

				const createRes = await prisma.user.create({
					data: {
						email: email,
						phone: phone,
						password: hashPass,
						first_name: firstName,
						middle_name: middleName,
						last_name: lastName,
					}
				})


				const token = jwt.sign({
					user: {
						email: createRes.email,
						phone: createRes.phone,
						first_name: createRes.first_name,
						middle_name: createRes.middle_name,
						last_name: createRes.last_name,
						is_active: createRes.is_active,
						is_blocked: createRes.is_blocked,
						createAt: createRes.createdAt,
						updatedAt: createRes.updatedAt,
						participantsId: createRes.participantsId,
					}
				}, jwt_secret, { expiresIn: '30d' })

				return {
					user: token,
					statusText: "Create user success!"
				}


			} catch (error) {
				return {
					error: error,
					user: undefined
				}
			}
		},
		postMessage: async (_parent: any, args: { content: string, senderId: string, conversationId: string, sender: { fname: string, lname: string } }) => {
			try {



				return {
					status: 200,
					statusText: "Sent"
				}


			} catch (error) {
				console.error("Error posting message:", error);
				throw new Error("Failed to post message");
			}

		}
	},

	// Subscription: {
	// 	heartBeat: {
	// 		subscribe: async (_parent: any, args: any, context: any) => {
	// 			console.log(_parent, args, await context);
	// 			return pubsub.asyncIterator(['HEART_BEAT']);
	// 		}
	// 	}
	// }

};
