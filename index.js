const { ApolloServer, gql } = require('apollo-server');

const {User, Post} = require("./models");

// The GraphQL schema
const typeDefs = gql`
  type PostType {
    title: String
    description: String
  }

  type UserType {
    id: Int
    name: String
    email: String
    posts: [PostType]
  }

  type Query {
    users: [UserType]
  }
`;

// A map of functions which return data for the schema.
const resolvers = {
  UserType: {
    posts: async (parent) => {
      return await Post.findAll({where: {userId: parent.id}});
    }
  },
  Query: {
    users: async () => {
      try {
        return await User.findAll()
      } catch (e) {
        console.log(e)
      }
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
