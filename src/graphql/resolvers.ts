import { PubSub } from "graphql-subscriptions";
import { PrismaClient } from "@prisma/client";
import { config } from 'dotenv';
import jwt from 'jsonwebtoken'
import bcrypt from "bcrypt";



config();

export const pubsub = new PubSub()
const prisma = new PrismaClient();

const jwt_secret = process.env.JWT_SECRET

export const resolvers = {
	Query: {

		login: async (_: any, args: any) => {
			try {

				if (!jwt_secret) {
					return {
						error: "Please set JWT_SECRET in .env file"
					}
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
							}
						}, jwt_secret, { expiresIn: '30d' })

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

		getAllUserConversation: async (_: any, args: { userId: string }) => {

			// find all conversation of the user
			const conversations = await prisma.conversation.findMany({
				where: {
					participants: {
						some: {
							id: args.userId
						}
					}
				},
				include: {
					participants: true,
					messages: true,
				}
			})

			return conversations
		},

		getAllConversationMessages: async (_: any, args: {conversationId: string}) => {
			try {
				
				const { conversationId } = args

				const messages = await prisma.message.findMany({
					where: {
						conversationId: conversationId
					}
				})

				
				return messages

			} catch (error) {
				console.log(error)
				return {
					error: error
				}
			}
		}

	},

	Mutation: {
		registerUser: async (_: any, args: any) => {
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
					}
				}, jwt_secret, { expiresIn: '1d' })

				return {
					user: token,
					statusText: "Create user success!"
				}
			} catch (error) {

				console.log(error)
				return {
					error: error,
					user: undefined
				}
			}
		},

		sendMessage: async (_parent: any, args: { senderId: string, recipientId: string, content: string } ) => {
			try {

				const { senderId, recipientId, content } = args

				let conversation = undefined

				const sender = await prisma.user.findUnique({
					where: {
						id: senderId
					}
				});

				const recipient = await prisma.user.findUnique({
					where: {
						id: recipientId
					},
				});

				if (!sender || !recipient) {
					return {
						error: "Sender or recipient not found",
					}
				}

				conversation = await prisma.conversation.findFirst({
					where: {
						AND: [
							{
								participants: {
									some: {
										id: senderId
									}
								}
							},
							{
								participants: {
									some: {
										id: recipientId
									}
								}
							}
						]
					},
					include: {
						participants: true
					}
				});


				if (!conversation) {

					conversation = await prisma.conversation.create({
						data: {
							creatorId: sender.id, // Replace with the actual creator's user ID
							participants: {
								connect: [{ id: sender.id }, { id: recipient.id }] // Replace with participant user IDs
							}
						},
						include: {
							participants: true
						}
					});

					if (!conversation) {
						return {
							error: "Failed to create conversation"
						}
					}

					const message = await prisma.message.create({
						data: {
							senderId: sender.id,
							content: content,
							conversationId: conversation.id,
						},
						include: {
							conversation: {
								include: {
									participants: true
								}
							}
						}
					})

					if (!message) {
						return {
							error: "Failed to send message"
						}
					}	

					pubsub.publish('MESSAGES', { messages: args }); 

					return {
						statusText: "Message sent!"
					}
				}

				else {

					const message = await prisma.message.create({
						data: {
							senderId: sender.id,
							content: content,
							conversationId: conversation.id,
						},
						include: {
							conversation: {
								include: {
									participants: true
								}
							}
						}
					})

					if (!message) {
						return {
							error: "Failed to send message"
						}
					}

					pubsub.publish('MESSAGES', { messages: args });

					return {
						statusText: "Message sent!"
					}
				}

			} catch (error) {
				console.log(error)
				return {
					error: error,
				}
			}
		},

		createPost(_: any, args: any, { postController }: any) {
      // Datastore logic lives in postController
			pubsub.publish('POST_CREATED', { postCreated: args }); 
      return postController.createPost(args);
    },
	},

	Subscription: {

		// heartBeat: {
		// 	subscribe: async (_parent: any, args: any, context: any) => {
		// 		console.log(_parent, args, await context);
		// 		return pubsub.asyncIterator(['HEART_BEAT']);
		// 	}
		// },

		messages: {
			subscribe: (_parent: any, args: any, context: any) => {
				console.log(_parent, args, context)
				return  pubsub.asyncIterator(['MESSAGES'])
			}
		},

		postCreated: {
      // More on pubsub below
      subscribe: () => pubsub.asyncIterator(['POST_CREATED']),
    },
		
	}

};
