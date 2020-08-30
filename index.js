const { ApolloServer, gql } = require('apollo-server');

const {User, Post} = require("./models");
const DataLoader = require('dataloader');

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

const postsLoader = new DataLoader( async (userIds) => {
  let posts = await Post.findAll( { where: { userId: userIds } } );

  let postsGroupedByUser = userIds.map ( userId => {
    return posts.filter( post => post.userId == userId );
  });

  return postsGroupedByUser;
})

// A map of functions which return data for the schema.
const resolvers = {
  UserType: {
    posts: (parent, _, ctx) => {
      return ctx.postsLoader.load(parent.id);
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
  context: async ({req}) => {
    return {
      postsLoader: postsLoader
    }
  }
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
