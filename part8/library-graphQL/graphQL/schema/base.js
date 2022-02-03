const { gql } = require('apollo-server')

const typeDefs = gql`
  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }

  type Subscription {
    _empty: String
  }
`

module.exports = { typeDefs }