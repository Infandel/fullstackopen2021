const { ApolloServer, UserInputError, AuthenticationError, gql } = require('apollo-server')
const { ApolloServerPluginLandingPageGraphQLPlayground } = require('apollo-server-core')
const mongoose = require('mongoose')
const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')
const jwt = require('jsonwebtoken')
require('dotenv').config()

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })


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

  type Author {
    name: String!
    id: ID!
    born: Int
    bookCount: Int!
  }

  type Book {
    title: String!
    published: Int!
    author: Author!
    id: ID!
    genres: [String!]!
  }

  input BookInput {
    title: String!
    published: Int!
    author: String!
    genres: [String!]!
  }

  type Query {
    authorCount: Int!
    bookCount: Int!
    allAuthors: [Author!]!
    allBooks(author: String, genre: String): [Book!]
    me: User
  }

  type Mutation {
    addBook(
      input: BookInput!
    ): Book!
    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author
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
    authorCount: () => Author.collection.countDocuments(),
    bookCount: () => Book.collection.countDocuments(),
    allAuthors: () => Author.find({}),
    allBooks: async (root, args) => {
      if (args.author && args.genre) {
        const author = await Author.findOne({ name: args.author })
        return Book.find({ $and: [
          { author: author._id },
          { genres: args.genre }
        ] }).populate('author')
      }
      else if (args.author) {
        const author = await Author.findOne({ name: args.author })
        return Book.find({ author: author._id }).populate('author')
      }
      else if (args.genre) {
        return Book.find({ genres: { $in: [ args.genre ] } }).populate('author')
      } else {
        return Book.find({}).populate('author')
      }
    },
    me: (root, args, context) => {
      return context.currentUser
    },
  },
  Author: {
    bookCount: async (root) => {
      const author = await Author.findOne({ name: root.name })
      const books = await Book.find({ author: author._id })
      return books.length
    }
  },
  Book: {
  },
  Mutation: {
    addBook: async (root, args, context) => {
      let author = await Author.findOne({ name: args.input.author })

      const currentUser = context.currentUser

      if (!currentUser) {
        throw new AuthenticationError("not authenticated")
      }

      if (author === null) {
        author = new Author({ name: args.input.author })
        try {
          await author.save()
        } catch (error) {
          throw new UserInputError(error.message, {
            invalidArgs: args,
          })
        }
      }
      const book = new Book({ ...args.input, author: author._id})
      try {
        await book.save()
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      }
      const savedBook = await book.populate('author').execPopulate()
      return savedBook
    },
    editAuthor: async (root, args, { currentUser }) => {
      const filter = { name: args.name }
      const update = { born: args.setBornTo }
      let author = null
      try {
        author = await Author.findOneAndUpdate(filter, update, {
          new: true, useFindAndModify: false
        });
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      }
      if (!currentUser) {
        throw new AuthenticationError("not authenticated")
      }
      return author
    },
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
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null
    if (auth && auth.toLowerCase().startsWith('bearer ')) {
      const decodedToken = jwt.verify(
        auth.substring(7), JWT_SECRET
      )
      const currentUser = await User.findById(decodedToken.id)
      return { currentUser }
    }
  },
  plugins: [
    ApolloServerPluginLandingPageGraphQLPlayground(),
  ],
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})