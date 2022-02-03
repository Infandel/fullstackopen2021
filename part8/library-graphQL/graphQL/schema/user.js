const { UserInputError, gql } = require('apollo-server')
const jwt = require('jsonwebtoken')

const User = require('../../models/user')

const JWT_SECRET = process.env.SECRET

const typeDefs = gql`
  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type TokenAndGenre {
    value: String!
    favoriteGenre: String!
  }

  extend type Query {
    me: User
  }

  extend type Mutation {
    createUser(
      username: String!
      favoriteGenre: String!
    ): User
    login(
      username: String!
      password: String!
    ): TokenAndGenre
  }
`

const resolvers = {
  Query: {
    me: (root, args, context) => {
      return context.currentUser
    },
  },
  Mutation: {
    createUser: (root, args) => {
      const user = new User({ username: args.username, favoriteGenre: args.favoriteGenre })

      return user.save()
        .catch(error => {
          throw new UserInputError(error.message, {
            invalidArgs: args,
          })
        })
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })

      if ( !user || args.password !== 'secret' ) {
        throw new UserInputError("wrong credentials")
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      }

      return {
        value: jwt.sign(userForToken, JWT_SECRET),
        favoriteGenre: user.favoriteGenre
      }
    },
  },
}

module.exports = { typeDefs, resolvers }