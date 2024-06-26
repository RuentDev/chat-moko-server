import { PubSub } from "graphql-subscriptions";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { GraphQLContext } from "../../util/types";
import { GraphQLError } from "graphql";

export const pubsub = new PubSub();

const jwt_secret = process.env.JWT_SECRET;

const resolvers = {
  Query: {
    searchConnections: async (_: any, { name }: {name: string}, context: GraphQLContext) => {
      try {
        const { session, prisma } = context

        if(!session){
          throw new GraphQLError("Not authorized")
        }

        const users = await prisma.user.findMany({
          where: {
            name: {
              contains: name,
              not: session.user?.name,
              mode: "insensitive",
            }
          },
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          }
        })

        if(!name){
          return {
            data: null
          }
        }

        return {
          data: users
        }

      } catch (error) {

        return {
          error: error
        }
        
      }
    },
    connections: async (_: any, __: any, context: GraphQLContext) => {
      try {
        const { session, prisma } = context;

        if(!session){
          return {
            error: "Not authorized" 
          }
        }

        if(!session.user){
          return {
            error: "Not authorized" 
          }
        }

        const connections = await prisma.user.findMany({
          where: {
            id: session.user.id
          },
          select: {
            connections: true
          }
        })


        return {
          data: connections,
          statusText: "OK"
        }
        
      } catch (error) {
        return {
          error: error
        }
      }
    },
  },

  Mutation: {
    userLogin: async (_: any, args: any, context: GraphQLContext) => {
      try {
        const { prisma, session } = context;

        if (!jwt_secret) {
          return {
            error: "Please set JWT_SECRET in .env file",
          };
        }

        const { email, password } = args;

        const user = await prisma.user.findUnique({
          where: {
            email: email,
          },
        });

        if (user && user.password) {
          const compareRes = bcrypt.compare(password, user.password);

          if (!compareRes) {
            return {
              error: "Ivalid username or password!",
            };
          }

          // FIND ALL SESSION THAT WILL EXPIRE WITHIN 1 MONTH
          // const session = await prisma.session.findFirst({
          //   where: {
          //     userId: user.id,
          //     expires: {
          //       gte: new Date(Date.now()),
          //       lte: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
          //     },
          //   },
          //   select: {
          //     sessionToken: true
          //   }
          // });

          // if(!session){
          //   return {
          //     error: "User not authorized"
          //   }
          // }

          const token = jwt.sign(
            {
              user: user,
            },
            jwt_secret,
            { expiresIn: "120s" }
          );

          return {
            token: token,
            statusText: "Login Success!",
          };
        }

        return {
          statusText: "User not registered!",
        };
      } catch (error) {
        return {
          error: error,
        };
      }
    },

    createUserAccount: async (_: any, args: any, context: GraphQLContext) => {
      try {
        const { session, prisma } = context;

        const { phone, password, firstName, middleName, lastName } = args;

        if (!session || !session.user) {
          return {
            error: "Session not available!",
          };
        }

        if (!jwt_secret)
          return {
            user: undefined,
            statusText: "Please set JWT_SECRET in .env file",
          };

        const userExist = await prisma.user.findUnique({
          where: {
            email: session.user.email,
          },
        });

        if (!userExist) {
          return {
            user: undefined,
            statusText: "This user it not registered",
          };
        }

        const saltRounds = 10;

        const salt = bcrypt.genSaltSync(saltRounds);
        const hashPass = bcrypt.hashSync(password, salt);

        const createRes = await prisma.user.update({
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
          },
        });

        const token = jwt.sign(
          {
            user: {
              email: createRes.email,
              name: createRes.name,
              phone: createRes.phone,
              first_name: createRes.first_name,
              middle_name: createRes.middle_name,
              last_name: createRes.last_name,
              is_active: createRes.is_active,
              is_blocked: createRes.is_blocked,
              createAt: createRes.createdAt,
              updatedAt: createRes.updatedAt,
            },
          },
          jwt_secret,
          { expiresIn: "1d" }
        );

        return {
          user: token,
          statusText: "Create user success!",
        };
      } catch (error) {
        return {
          error: error,
        };
      }
    },

    registerUser: async (_: any, args: any, context: GraphQLContext) => {
      try {

        const { prisma } = context
        if (!jwt_secret){
          return {
            error: "Please set JWT_SECRET in .env file",
          };
        }

        const { email, phone, password, firstName, middleName, lastName } = args;

        const userExist = await prisma.user.findUnique({
          where: {
            email: email,
          },
        });

        if (userExist) {
          return {
            error: "This user are already registered! Please use another email",
          };
        }

        const saltRounds = 10;

        const salt = bcrypt.genSaltSync(saltRounds);
        const hashPass = bcrypt.hashSync(password, salt);

        const user = await prisma.user.create({
          data: {
            email: email,
            name: `${firstName} ${middleName} ${lastName}`,
            phone: phone,
            password: hashPass,
            first_name: firstName,
            middle_name: middleName,
            last_name: lastName,
          },
        });

        if(!user){
          return {
            error: "Failed to create user!",
          }
        }

        return {
          statusText: "Create user success!",
        };
      } catch (error) {
        return {
          error: error,
        };
      }
    },

    addConnection: async(_: any, args: {id: string}, context: GraphQLContext) => {
      try {
        const { session, prisma } = context

        if(!session){
          return {
            error: "Not Authorized!"
          }
        }


        if(!session.user){
          return {
            error: "Not Authorized!"
          }
        }



        const connection = await prisma.user.update({
          where: {
            id: session.user.id
          },
          data: {
            connections: {
              connect: {
                id: args.id,
              }
            }
          },
          include: {
            connections: true
          }
        })

        return {
          data: connection,
          statusText: "Connection Added!"
        }

      } catch (error) {
        return {
          error: error
        }
      }
    }
  },

  // Subscription: {}
};

export default resolvers;
