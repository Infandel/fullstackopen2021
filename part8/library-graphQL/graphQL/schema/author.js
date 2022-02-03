const { UserInputError, AuthenticationError, gql } = require('apollo-server')

const Author = require('../../models/author')
// const Book = require('../../models/book')

const typeDefs = gql`
  type Author {
    name: String!
    id: ID!
    born: Int
    bookCount: Int!
  }

  extend type Query {
    authorCount: Int!
    allAuthors: [Author!]!
  }

  extend type Mutation {
    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author
  }
`

const resolvers = {
  Query: {
    authorCount: () => Author.collection.countDocuments(),
    allAuthors: () => Author.find({}),
  },
  Author: {
    // bookCount: async (root) => {
    //   const author = await Author.findOne({ name: root.name })
    //   const books = await Book.find({ author: author._id })
    //   console.log("Book counted")
    //   return books.length
    // }
    bookCount: ({ id }, args, { bookCountLoader }) => {
      console.log("books counted")
      return bookCountLoader.load(id.toString())
    }
  },
  Mutation: {
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
  },
}

module.exports = { typeDefs, resolvers }
