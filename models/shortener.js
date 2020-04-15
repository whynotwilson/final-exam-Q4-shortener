const mongoose = require('mongoose')
const Schema = mongoose.Schema

const shortenerSchema = new Schema({
  shortenURL: {
    type: String,
    require: true
  },
  originalUrl: {
    type: String,
    require: true
  }
})
module.exports = mongoose.model('Shortener', shortenerSchema)
