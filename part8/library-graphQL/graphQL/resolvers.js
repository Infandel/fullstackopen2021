const merge = require('lodash/merge')

const { resolvers: authorResolvers } = require('./schema/author')
const { resolvers: bookResolvers } = require('./schema/book')
const { resolvers: userResolvers } = require('./schema/user')

const resolvers = merge({}, authorResolvers, bookResolvers, userResolvers)

module.exports = resolvers