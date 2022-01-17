const { ApolloServer, UserInputError, gql } = require('apollo-server')
const { ApolloServerPluginLandingPageGraphQLPlayground } = require('apollo-server-core')
const mongoose = require('mongoose')
const Author = require('./models/author')
const Book = require('./models/book')
require('dotenv').config()

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

const typeDefs = gql`
  type Author {
    name: String!
    id: ID
    born: Int
    bookCount: Int
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
  }

  type Mutation {
    addBook(
      input: BookInput!
    ): Book!
    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author
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
    // addBook: (root, args) => {
    //   const book = { ...args, id: uuid() }
    //   books = books.concat(book)

    //   if (authors.filter(a => a.name === book.author).length === 0) {
    //     const author = { name: book.author, id: uuid() }
    //     authors = authors.concat(author)
    //   }
    //   return book
    // },
    addBook: async (root, args) => {
      let author = await Author.findOne({ name: args.input.author })

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
      return book
    },
    editAuthor: async (root, args) => {
      const author = await Author.findOne({ name: args.name })
      if (!author) {
        return null
      }

      author.born = args.setBornTo
      try {
        await author.save()
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      }
      return author
    }
    // editAuthor: (root, args) => {
    //   const author = authors.find(a => a.name === args.name)
    //   if (!author) {
    //     return null
    //   }

    //   const updatedAuthor = { ...author, born: args.setBornTo }
    //   authors = authors.map(a => a.name === args.name ? updatedAuthor : a)

    //   return updatedAuthor
    // }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [
    ApolloServerPluginLandingPageGraphQLPlayground(),
  ],
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})