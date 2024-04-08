import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken'
import { PubSub } from 'graphql-subscriptions';
import { PrismaClient } from "@prisma/client";
import { subscribe } from "diagnostics_channel";


const pubsub = new PubSub();
const prisma = new PrismaClient();


export const resolvers = {
	Query: {

		login: async (_parent: any, args: any) => {

			console.log(args)

			return {
				status: 200,
				statusText: "",

			}
		},

		register: async (_parent: any, args: any) => {
			
			return {
				status: 200,
				statusText: "",

			}
		},

		getMessages: async (_parent: any, args: any) => {
			
			const data =  await prisma.message.findMany({
				where: {
					conversationId: args.conversationId
				}
			})

			console.log(data)

			

			return "test"
		}

	},

	Mutation: {
		postMessage: async (_parent: any, args: {content: string, senderId: string, conversationId: string, sender: {fname: string, lname:string}}) => {
			try {
				let conversation;
				// Check if conversation already exists
				const existingConversation = await prisma.conversation.findUnique({
						where: {
								id: args.conversationId
						}
				});

				// If conversation does not exist, create it
				if (!existingConversation) {
						conversation = await prisma.conversation.create({
								data: {
										id: args.conversationId, // Ensure conversation id is passed
										// Optionally, add participants if needed
								}
						});
				} else {
						conversation = existingConversation;
				}

				// Create message
				const message = await prisma.message.create({
						data: {
							content: args.content,
							senderId: args.senderId,
							conversationId: args.conversationId,
						}
				});

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
