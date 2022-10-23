const express = require('express')
const app = express()

let persons = [
	{ 
		"name": "Arto Hellas", 
	  	"number": "040-123456",
	 	"id": 1
	},
	{ 
	 	"name": "Ada Lovelace", 
	  	"number": "39-44-5323523",
	  	"id": 2
	},
	{ 
	  	"name": "Dan Abramov", 
	  	"number": "12-43-234345",
	  	"id": 3
	},
	{ 
	  	"name": "Mary Poppendieck", 
	  	"number": "39-23-6423122",
	  	"id": 4
	}
]

app.use(express.json())

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || body.number) {
	return response.status(400).json({ 
	  error: 'content missing' 
	})
  }
  if (body.name === persons.map(person => person.name)) {
	return response.status(400).json({ 
	  error: 'name must be unique' 
	})
  }

  const person = {
	"name": body.content,
	"number": body.number,
	id: Math.floor(Math.random() * 10000),
  }

  persons = persons.concat(person)

  response.json(person)
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/info', (req, res) => {
	res.send(`<p>Phonebook has info for ${persons.length} people</p>
	<p>${new Date()}</p>`)
  })

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)

  if (person) {
	response.json(person)
  } else {
	response.status(404).end()
  }
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})