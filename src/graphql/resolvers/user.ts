import { PubSub } from "graphql-subscriptions";
import { PrismaClient } from "@prisma/client";
import jwt from 'jsonwebtoken'
import bcrypt from "bcrypt";


export const pubsub = new PubSub()
const prisma = new PrismaClient();

const jwt_secret = process.env.JWT_SECRET


const resolvers = {


  Query: {
    userLogin: async (_: any, args: any) => {
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
  },


  // Subscription: {

  // }


}


export default resolvers;