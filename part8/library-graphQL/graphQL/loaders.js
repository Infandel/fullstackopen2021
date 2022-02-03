const DataLoader = require("dataloader")
const countBy = require("lodash/countBy")
const Book = require("../models/book")

const smartBookCounter = () => {
  return new DataLoader(async (authorIds) => {
    const books = await Book.find({})
    const booksByAuthorId = books.map((b) => b.author)
    const authorIdCounts = countBy(booksByAuthorId, (id) => id)

    return authorIds.map((id) => authorIdCounts[id] || 0)
  })
}

module.exports = { smartBookCounter }