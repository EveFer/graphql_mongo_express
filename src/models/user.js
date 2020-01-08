const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name: String,
    email: String,
    password: String,
    date: String
})

const User = mongoose.model('use', userSchema)

module.exports = User