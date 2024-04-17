import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import { PubSub } from 'graphql-subscriptions';
import { PrismaClient } from "@prisma/client";
import { config } from 'dotenv';
config();
const pubsub = new PubSub();
const prisma = new PrismaClient();
const jwt_secret = process.env.JWT_SECRET;
export const resolvers = {
    Query: {
        login: async (_parent, args) => {
            try {
                if (!jwt_secret)
                    return {
                        user: undefined,
                        statusText: "Please set JWT_SECRET in .env file"
                    };
                const { username, password } = args;
                const userEmailExist = await prisma.user.findUnique({
                    where: {
                        email: username
                    }
                });
                if (userEmailExist) {
                    const { password: encodedPassword } = userEmailExist;
                    if (encodedPassword) {
                        const compareRes = await bcrypt.compare(password, encodedPassword);
                        if (!compareRes) {
                            return {
                                user: undefined,
                                statusText: "Ivalid username or password!"
                            };
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
                        }, jwt_secret, { expiresIn: '30d' });
                        return {
                            user: token,
                            statusText: "Login Success!"
                        };
                    }
                }
                else {
                    return {
                        user: undefined,
                        statusText: "User not registered!"
                    };
                }
            }
            catch (error) {
                return {
                    error: error,
                    user: undefined
                };
            }
        },
        getMessages: async (_parent, args) => {
            const data = await prisma.conversation.findMany();
            console.log(data);
            return "test";
        }
    },
    Mutation: {
        registerUser: async (parent, args) => {
            try {
                if (!jwt_secret)
                    return {
                        user: undefined,
                        statusText: "Please set JWT_SECRET in .env file"
                    };
                const { email, phone, password, firstName, middleName, lastName } = args;
                const userExist = await prisma.user.findUnique({
                    where: {
                        email: email
                    }
                });
                if (userExist) {
                    return {
                        user: undefined,
                        statusText: "This user are already registered! Please use another email"
                    };
                }
                const saltRounds = 10;
                const salt = bcrypt.genSaltSync(saltRounds);
                const hashPass = bcrypt.hashSync(password, salt);
                const createRes = await prisma.user.create({
                    data: {
                        email: email,
                        phone: phone,
                        password: hashPass,
                        first_name: firstName,
                        middle_name: middleName,
                        last_name: lastName,
                    }
                });
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
                }, jwt_secret, { expiresIn: '1d' });
                return {
                    user: token,
                    statusText: "Create user success!"
                };
            }
            catch (error) {
                return {
                    error: error,
                    user: undefined
                };
            }
        },
        sendMessage: async (_parent, { senderId, recipientId, message }) => {
            try {
                const sender = await prisma.user.findUnique({
                    where: { id: senderId },
                });
                const recipient = await prisma.user.findUnique({
                    where: { id: recipientId },
                });
                if (!sender || !recipient) {
                    throw new Error('Sender or recipient not found');
                }
                const newMessage = await prisma.message.create({
                    data: {
                        sender_id: senderId,
                        message,
                        conversation_id: 0,
                        message_type: "SINGLE_CHAT",
                    },
                });
                return {
                    status: 200,
                    statusText: "Sent"
                };
            }
            catch (error) {
                console.error("Error posting message:", error);
                throw new Error("Failed to post message");
            }
        }
    },
};
//# sourceMappingURL=resolvers.js.map