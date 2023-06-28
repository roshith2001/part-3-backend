const mongoose = require('mongoose')

const uri = process.env.MONGO_URI

mongoose.set('strictQuery', false)
mongoose.connect(uri)

const phoneSchema = new mongoose.Schema({
	name: {
		type: String,
		minLength: 3,
		required: true
	},
	number: {
		type: String,
		minLength: 9,
		validate: {
			validator: function(v){
				return /^\d{2,3}-\d+$/.test(v)
			},
			message: props => `${props.value} should have 2 or 3 numbers before the hyphen!`
		},
		required: true
	}
})

phoneSchema.set('toJSON', {
	transform: (document, returnedDocument) => {
		returnedDocument.id = returnedDocument._id.toString()
		delete returnedDocument._id
		delete returnedDocument.__v
	}
})

module.exports = mongoose.model('Phone', phoneSchema)