"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pubsub = void 0;
const graphql_subscriptions_1 = require("graphql-subscriptions");
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
exports.pubsub = new graphql_subscriptions_1.PubSub();
const prisma = new client_1.PrismaClient();
const jwt_secret = process.env.JWT_SECRET;
const resolvers = {
    // Query: {},
    Mutation: {
        userLogin: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                if (!jwt_secret) {
                    return {
                        error: "Please set JWT_SECRET in .env file"
                    };
                }
                const { username, password } = args;
                const userEmailExist = yield prisma.user.findUnique({
                    where: {
                        email: username
                    }
                });
                if (userEmailExist) {
                    const { password: encodedPassword } = userEmailExist;
                    if (encodedPassword) {
                        const compareRes = yield bcrypt_1.default.compare(password, encodedPassword);
                        if (!compareRes) {
                            return {
                                user: undefined,
                                statusText: "Ivalid username or password!"
                            };
                        }
                        const token = jsonwebtoken_1.default.sign({
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
        }),
        createUserAccount: (_, args, context) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const { session, prisma } = context;
                const { phone, password, firstName, middleName, lastName } = args;
                if (!session || !session.user) {
                    return {
                        error: "Session not available!"
                    };
                }
                if (!jwt_secret)
                    return {
                        user: undefined,
                        statusText: "Please set JWT_SECRET in .env file"
                    };
                const userExist = yield prisma.user.findUnique({
                    where: {
                        email: session.user.email
                    }
                });
                if (!userExist) {
                    return {
                        user: undefined,
                        statusText: "This user it not registered"
                    };
                }
                const saltRounds = 10;
                const salt = bcrypt_1.default.genSaltSync(saltRounds);
                const hashPass = bcrypt_1.default.hashSync(password, salt);
                const createRes = yield prisma.user.update({
                    where: {
                        id: userExist.id,
                    },
                    data: {
                        phone: phone,
                        password: hashPass,
                        first_name: firstName,
                        middle_name: middleName,
                        last_name: lastName,
                        emailVerified: new Date(),
                    }
                });
                const token = jsonwebtoken_1.default.sign({
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
                }, jwt_secret, { expiresIn: '1d' });
                return {
                    user: token,
                    statusText: "Create user success!"
                };
            }
            catch (error) {
                return {
                    error: error
                };
            }
        }),
        registerUser: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                if (!jwt_secret)
                    return {
                        user: undefined,
                        statusText: "Please set JWT_SECRET in .env file"
                    };
                const { email, phone, password, firstName, middleName, lastName } = args;
                const userExist = yield prisma.user.findUnique({
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
                const salt = bcrypt_1.default.genSaltSync(saltRounds);
                const hashPass = bcrypt_1.default.hashSync(password, salt);
                const createRes = yield prisma.user.create({
                    data: {
                        email: email,
                        phone: phone,
                        password: hashPass,
                        first_name: firstName,
                        middle_name: middleName,
                        last_name: lastName,
                    }
                });
                const token = jsonwebtoken_1.default.sign({
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
                }, jwt_secret, { expiresIn: '1d' });
                return {
                    user: token,
                    statusText: "Create user success!"
                };
            }
            catch (error) {
                console.log(error);
                return {
                    error: error
                };
            }
        }),
    },
    // Subscription: {
    // }
};
exports.default = resolvers;
//# sourceMappingURL=user.js.map