const { typeDefs: Author } = require('./schema/author')
const { typeDefs: Book } = require('./schema/book')
const { typeDefs: User } = require('./schema/user')
const { typeDefs: base } = require('./schema/base')

const typeDefs = [base, Author, Book, User]

module.exports = typeDefs