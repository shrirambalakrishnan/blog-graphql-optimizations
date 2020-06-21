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

  Query: {
    users: async () => {
      try {
        console.log(User)

        let users = await User.findAll()
        let userIds = users.map( user => user.id)
        let posts = await Post.findAll({where: {userId: userIds}});

        let usersData = users.map( user => {
          let userPosts = posts.filter( post => post.userId == user.id);

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            posts: userPosts.map ( post => {
              return { title: post.title, description: post.description }
            })
          }
        })

        return usersData
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
