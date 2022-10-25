require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
const app = express()

app.use(express.static('build'))
app.use(express.json())
morgan.token("body", function (req) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :body'))
app.use(cors())

const errorHandler = (error, request, response, next) => {
	console.error(error.message)
	if (error.name === 'CastError') {
	  	return response.status(400).send({ error: 'malformatted id' })
	} else if (error.name === 'ValidationError') {
		return response.status(400).json({ error: error.message })
	}
	next(error)
  }

app.use(errorHandler)

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if (!body.name || !body.number) {
	return response.status(400).json({ 
	  error: 'content missing' 
	})
  }

  const person = new Person({
	_id: Math.floor(Math.random()*10000),
	"name": body.name,
	"number": body.number,
  })

  person
    .save()
    .then(p => {
        response.json(p.toJSON())
    })
    .catch(err => next(err))

})

app.get('/api/persons', (req, res) => {
	Person.find({}).then(person => {
		res.json(person)
	})
})

app.get('/info', (req, res) => {
	Person.collection
        .countDocuments({})
        .then(res => (persons = res))
        .finally(() => res.send(`<p>Phonebook has info for ${persons} people</p><p>${new Date()}</p>`))
})

app.delete('/api/persons/:id', (request, response, next) => {
  const id = Number(request.params.id)
  Person.findByIdAndRemove(id)
    .then(() => res.status(204).end())
    .catch(err => next(err))
})

app.get('/api/persons/:id', (request, response, next) => {
  const id = Number(request.params.id)
  Person.findById(id)
    .then(person => {
        if (person) res.json(person.toJSON())
        else res.status(404).end()
    })
    .catch(err => next(err))
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})