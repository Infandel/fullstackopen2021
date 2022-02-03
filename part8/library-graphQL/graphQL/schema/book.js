const { UserInputError, AuthenticationError, gql } = require('apollo-server')
const { PubSub } = require('graphql-subscriptions')

const Author = require('../../models/author')
const Book = require('../../models/book')

const pubsub = new PubSub()

const typeDefs = gql`
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

  extend type Query {
    bookCount: Int!
    allBooks(author: String, genre: String): [Book!]
  }

  extend type Mutation {
    addBook(
      input: BookInput!
    ): Book!
  }

  extend type Subscription {
    bookAdded: Book!
  }
`

const resolvers = {
  Query: {
    bookCount: () => Book.collection.countDocuments(),
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

      pubsub.publish('BOOK_ADDED', { bookAdded: savedBook })
      return savedBook
    },
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator(['BOOK_ADDED'])
    },
  },
}

module.exports = { typeDefs, resolvers }