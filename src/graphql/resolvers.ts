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
			
			const data =  await prisma.conversation.findMany()
			console.log(data)
			return "test"
		}

	},

	Mutation: {
		postMessage: async (_parent: any, args: {content: string, senderId: string, conversationId: string, sender: {fname: string, lname:string}}) => {
			try {

				const message = await prisma.message.create({
					data: {
						content: args.content,
						senderId: args.senderId,
						conversationId: args.conversationId,
					}
				});

				console.log(message)

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
