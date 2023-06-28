const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()


app.use(express.json())
app.use(cors())
app.use(express.static('build'))

let phone = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

const date = new Date()
morgan.token('content', function(req,res){
  if(req.method === 'POST'){
    return JSON.stringify(req.body)
  }
  return null
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'))


app.get('/info', (req,res) => {
    res.send(`
        Phonebook have details for ${phone.length} peoples
        <br/>
        ${date.toString()}
        `)
})

app.get('/api/persons', (req,res) => {
    res.json(phone)
})

app.get('/api/persons/:id', (req,res) => {
    const id = Number(req.params.id)
    const phoneNumber = phone.find(item => item.id === id)
    if(phoneNumber){
        res.json(phoneNumber)
    }
    else{
        res.status(404).send('Item is not found')
    }
})

app.post('/api/persons', (req,res) => {
  const newPhone = req.body
  const duplicate = phone.find(item => item.name === newPhone.name)
    if(!newPhone.name || !newPhone.number){
      res.status(400).json({error: 'Content Missing'})
    }
    if(duplicate){
      res.status(400).json({error: 'Name already in PhoneBook'})
    }
    const id = Math.floor(Math.random()*100)
    newPhone.id = id
    phone = phone.concat(newPhone)
    res.json(phone)
})

app.delete('/api/persons/:id', (req,res) => {
    const id = Number(req.params.id)
    phone = phone.filter(item => item.id !== id)

    res.status(204).end()
})

const PORT = process.env.PORT || 3001

app.listen(PORT)
console.log(`Server is running successfully on Port ${PORT}`)
