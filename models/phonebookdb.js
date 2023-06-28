const mongoose = require('mongoose')

const uri = process.env.MONGO_URI

mongoose.set('strictQuery', false)
mongoose.connect(uri)

const phoneSchema = new mongoose.Schema({
    name: String,
    number: Number
})

phoneSchema.set('toJSON', {
    transform: (document, returnedDocument) => {
        returnedDocument.id = returnedDocument._id.toString()
        delete returnedDocument._id
        delete returnedDocument.__v
    }
})

module.exports = mongoose.model('Phone', phoneSchema)