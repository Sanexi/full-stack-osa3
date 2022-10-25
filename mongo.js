const mongoose = require('mongoose')

if (process.argv.length<3) {
    console.log('give password as argument')
    process.exit(1)
  }

const password = process.argv[2]

const url = `mongodb+srv://fullstack:${password}@puhelinluettelo.aoatd1s.mongodb.net/?retryWrites=true&w=majority`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
        name: String,
        number: String,
        _id: mongoose.Types.ObjectId,
    })
  
const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 5) {
    const id = mongoose.Types.ObjectId()
    const person = new Person({
        "name": process.argv[3], 
        "number": process.argv[4],
        _id: id
    })

    person.save().then(result => {
        console.log(`added ${process.argv[3]} number ${process.argv[4]} to phonebook`)
        mongoose.connection.close()
    })
}

if (process.argv.length === 3) {
    Person.find({}).then(result => {
        console.log("phonebook:")
        result.forEach(person => {
            console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
      })
}
