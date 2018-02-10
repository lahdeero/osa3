const mongoose = require('mongoose')

const url = 'mongodb://xxx:xxx@ds229008.mlab.com:29008/fullstack-phonebook'

mongoose.connect(url)
mongoose.Promise = global.Promise

const Person = mongoose.model('Person', {
  name: String,
  number: String
})

module.exports = Person
