const { ApolloServer } = require('apollo-server')
const mongoose = require('mongoose')
const User = require('./models/user')
const jwt = require('jsonwebtoken')
const { MONGODB_URI, SECRET } = require('./utils/config')
const typeDefs = require('./graphQL/typeDefs')
const resolvers = require('./graphQL/resolvers')
const { smartBookCounter } = require('./graphQL/loaders')

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

mongoose.set('debug', true);

const JWT_SECRET = SECRET

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const bookCountLoader = smartBookCounter()

    const auth = req ? req.headers.authorization : null
    if (auth && auth.toLowerCase().startsWith('bearer ')) {
      const decodedToken = jwt.verify(
        auth.substring(7), JWT_SECRET
      )
      const currentUser = await User.findById(decodedToken.id)
      return { bookCountLoader, currentUser }
    }

    return { bookCountLoader }
  },
})

server.listen().then(({ url, subscriptionsUrl }) => {
  console.log(`Server ready at ${url}`)
  console.log(`Subscriptions ready at ${subscriptionsUrl}`)
})