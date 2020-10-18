const { ApolloServer, gql } = require('apollo-server');

const { User, Post } = require("./models");
const { postsLoader, commentsLoader } = require("./src/dataloaders")
const { AuthDirective } = require("./src/directives/auth")

// The GraphQL schema
const typeDefs = gql`
  directive @auth(
    requires: Role = ADMIN
  ) on FIELD_DEFINITION

  enum Role {
    ADMIN
    REVIEWER
    USER
    UNKNOWN
  }

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
    comments: [CommentType] @auth(requires: USER)
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
  typeDefs,
  resolvers,
  schemaDirectives: {
    auth: AuthDirective
  },
  context: async ({req}) => {
    return {
      postsLoader: postsLoader,
      commentsLoader: commentsLoader,
      user: {
        id: 100,
        email: "admin@admin.com",
        roles: ["USER"]
      }
    }
  }
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
