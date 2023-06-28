const mongoose = require('mongoose')

if(process.argv.length < 3){
    console.log('Give Password')
    process.exit(1)
}

const password = process.argv[2]

const uri = `mongodb+srv://roshithkrishnap:${password}@fullstackopen.ejqdu5i.mongodb.net/phoneBook?retryWrites=true&w=majority`


mongoose.set('strictQuery', false)
mongoose.connect(uri)

const phoneSchema = new mongoose.Schema({
    name: String,
    number: Number
})

const Phone = mongoose.model('Phone', phoneSchema)

const addPhone = new Phone({
    name: process.argv[3],
    number: process.argv[4]
})

addPhone.save().then(result => {
    console.log(`added ${result.name} ${result.number} to phonebook`)
})

Phone.find({}).then(result=>{
    console.log('Phonebook:')
    result.forEach(item=>{
        console.log(`   ${item.name} ${item.number}`)
    })
    mongoose.connection.close()
})