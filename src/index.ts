import { startStandaloneServer } from '@apollo/server/standalone';
import { resolvers } from './graphql/resolvers.js';
import {typeDefs} from './graphql/typesDefs.js'
import { ApolloServer } from '@apollo/server';
import { config } from 'dotenv';
config();


async function init() {
  // const app = express();
  const PORT = 4000;

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  const { url } = await startStandaloneServer(server, {
    listen: { port: PORT },
  });

  console.log(`🚀  Server ready at: ${url}`);

}




init();

