const { ApolloServer, gql, makeExecutableSchema } = require('apollo-server');
const { applyMiddleware } = require('graphql-middleware');

const {User, Post} = require("./models");
const { postsLoader, commentsLoader } = require("./src/dataloaders")
const { permissions } = require("./src/middlewares/permissions")

// The GraphQL schema
const typeDefs = gql`
  input PostInputType {
    id: Int!
    title: String!
    description: String
  }

  type CommentType {
    id: Int!
    comment: String!
  }

  type PostType {
    id: Int!
    title: String
    description: String
    comments: [CommentType]
  }

  type UserType {
    id: Int
    name: String
    email: String
    posts: [PostType]
  }

  type Query {
    users: [UserType]
    posts: [PostType]
  }

  type Mutation {
    updatePost(data: PostInputType): PostType
  }
`;



// A map of functions which return data for the schema.
const resolvers = {
  PostType: {
    comments: (parent, _, ctx) => {
      return ctx.commentsLoader.load(parent.id);
    }
  },
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
    posts: async () => {
      try {
        return await Post.findAll()
      } catch (e) {
        console.log(e)
      }
    }
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
  schema: applyMiddleware(
    makeExecutableSchema({typeDefs, resolvers}),
    permissions
  ),
  context: async ({req}) => {
    return {
      postsLoader: postsLoader,
      commentsLoader: commentsLoader,
      user: {
        id: 100,
        email: "user@gmail.com",
        roles: ["USER"]
      }
    }
  }
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
