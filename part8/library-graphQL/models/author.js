const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Authors must have a name"],
    unique: true,
    minlength: [4, "Author name should be at least 4 characters long"]
  },
  born: {
    type: Number,
  },
})

schema.plugin(uniqueValidator)
module.exports = mongoose.model('Author', schema)