import bcrypt from "bcrypt";
import { PubSub } from 'graphql-subscriptions';
import { PrismaClient } from "@prisma/client";
const pubsub = new PubSub();
const prisma = new PrismaClient();
export const resolvers = {
    Query: {
        login: async (_parent, args) => {
            try {
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
                        console.log(password, encodedPassword);
                        if (!compareRes) {
                            return {
                                status: 200,
                                statusText: "Please put a valid username or password"
                            };
                        }
                        return {
                            status: 200,
                            statusText: "Login success!"
                        };
                    }
                }
                else {
                    return {
                        status: 200,
                        statusText: "User not registered!"
                    };
                }
            }
            catch (error) {
                return {
                    status: 400,
                    statusText: error,
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
                const { email, phone, password, firstName, middleName, lastName } = args;
                const userExist = await prisma.user.findUnique({
                    where: {
                        email: email
                    }
                });
                if (userExist) {
                    return {
                        status: 200,
                        statusText: "This user are already registered! Please use another email"
                    };
                }
                let createRes = undefined;
                const saltRounds = 10;
                bcrypt.genSalt(saltRounds, function (err, salt) {
                    if (err) {
                        return {
                            status: 400,
                            statusText: "Error while generating saltRounds!"
                        };
                    }
                    bcrypt.hash(password, saltRounds, async (err, hash) => {
                        if (err) {
                            return {
                                status: 400,
                                statusText: "Error while hashing the password!"
                            };
                        }
                        createRes = await prisma.user.create({
                            data: {
                                email: email,
                                phone: phone,
                                password: hash,
                                first_name: firstName,
                                middle_name: middleName,
                                last_name: lastName,
                            }
                        });
                    });
                });
                return {
                    status: 200,
                    statusText: "Create user success!"
                };
            }
            catch (error) {
                return {
                    status: 400,
                    statusText: error
                };
            }
        },
        postMessage: async (_parent, args) => {
            try {
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