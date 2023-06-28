const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()
const app = express()
const Note = require('./models/phonebookdb')


app.use(express.json())
app.use(cors())
app.use(express.static('build'))

const errorHandler = (error, req, res, next) => {
	console.log(error.message)
	if(error.name === 'CastError'){
		res.status(400).send({ error: 'Malformatted ID given' })
	}
	else if(error.name === 'ValidationError'){
		res.status(400).send({ error: error.message })
	}
	next(error)
}

const date = new Date()
morgan.token('content', function(req,res){
	console.log(res)
	if(req.method === 'POST'){
		return JSON.stringify(req.body)
	}
	return null
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'))


app.get('/info', (req,res) => {
	Note.countDocuments()
		.then(result => {
			res.send(`
        Phonebook have details for ${result} peoples
        <br/>
        ${date.toString()}
        `)
		})
})

app.get('/api/persons', (req,res) => {
	Note.find({}).then(result => {
		res.json(result)
	})
})

app.get('/api/persons/:id', (req, res, next) => {
	Note.findById(req.params.id).then(result => {
		res.json(result)
	})
		.catch(error => {
			next(error)
		})
})

app.post('/api/persons', (req, res, next) => {
	const body = req.body
	if(!body.name || !body.number){
		res.status(400).json({ error: 'Content Missing' })
	}

	const newEntry = new Note({
		name: body.name,
		number: body.number || null
	})
	newEntry.save().then(result => {
		console.log(result)
		Note.find({}).then(items => {
			res.json(items)
		})
	})
		.catch(error => {
			console.log(error)
			next(error)
		})
})

app.put('/api/persons/:id', (req,res,next) => {

	const body = req.body
	const newPhoneChange = {
		name: body.name,
		number: body.number,
	}

	Note.findByIdAndUpdate(req.params.id, newPhoneChange, {
		new: true, runValidators: true, context: 'query'
	})
		.then(result => {
			res.json(result)
		})
		.catch(error => {
			console.log(error)
			next(error)
		})
})

app.delete('/api/persons/:id', (req,res, next) => {
	Note.findByIdAndDelete(req.params.id).then(result => {
		res.json(result)
	})
		.catch(error => {
			next(error)
		})
})
app.use(errorHandler)
const PORT = process.env.PORT || 3001

app.listen(PORT)
console.log(`Server is running successfully on Port ${PORT}`)
