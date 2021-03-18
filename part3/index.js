const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()



app.use(express.json())
app.use(cors())

let persons = [
  {
    id: 1,
    name: "Jhonny Bravo",
    number: "414-5151515"
  },
  {
    id: 2,
    name: "Billy Bonka",
    number: "14144-155151"
  },
  {
    id: 3,
    name: "Uma Turman",
    number: "99999-55522"
  }
]

app.get('/info', (request, response) => {
  response.send(`
    <p>Phonebook has info for ${persons.length} people<p>
    <p>${new Date}<p>
  `)
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
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

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

const generateId = () => {
  const randomId = persons.length > 0
    ? Math.floor(Math.random() * Math.floor(100000))
    : 0
  return randomId
}

morgan.token('data',  (req) => {
  return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'name or number is missing' 
    })
  }

  if (persons.filter(n => n.name === body.name).length > 0) {
    return response.status(400).json({
      error: 'name must be unique'
    })
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number
  }
  persons = persons.concat(person)

  response.json(person)
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})