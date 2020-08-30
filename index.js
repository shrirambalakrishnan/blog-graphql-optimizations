const { ApolloServer, gql } = require('apollo-server');

const {User, Post} = require("./models");
const DataLoader = require('dataloader');

// The GraphQL schema
const typeDefs = gql`
  input PostInputType {
    id: Int!
    title: String!
    description: String
  }

  type PostType {
    id: Int!
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

  type Mutation {
    updatePost(data: PostInputType): PostType
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
  Mutation: {
    updatePost: async (parent, args, ctx) => {
      let { id, title, description } = args.data;

      try{
        let post = await Post.findOne( { where: { id: id }} )

        post.title = title
        post.description = description
        post.save()

        return post;
      } catch (e) {
        console.log(e);
        throw e;
      }
    }
  }
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
