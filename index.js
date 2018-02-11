const express = require('express')
const app = express()
const bodyParser = require('body-parser')
var morgan  = require('morgan')
const Person = require('./models/person')

morgan.token('type', function (req, res) { return JSON.stringify(req.body) })

app.use(express.static('build'))
app.use(bodyParser.json())
app.use(morgan(':method :url :type :status :res[content-length] - :response-time ms'))


const formatPerson = (person) => {
  return {
    name: person.name,
    number: person.number,
    id: person._id
  }
}

const generateDate = () => {
  let today = new Date()
  return today
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (body.name === undefined) {
    return response.status(400).json({error: 'name missing'})
  } /*else if (persons.find(person => person.name === body.name)) {
    return response.status(400).json({error: 'name must be unique'})
  }*/
  
  if (body.number === undefined) {
    return response.status(400).json({error: 'number missing'})
  }

  let personMap = new Array()

  const person = new Person({
    name: body.name,
    number: body.number
  })

  Person
    .find({})
    .then(result => {
      result.forEach(person => {
        personMap.push(person)
      })
      if (personMap.find(e => e.name === body.name) === undefined) {
        person
          .save()
          .then(formatPerson)
          .then(savedAndFormattedPerson => {
            response.json(formatPerson(savedAndFormattedPerson))
       })
      } else {
        response.json('Name already exists')
      }
    })

})

app.put('/api/persons/:id', (request, response) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number
  }

  Person
    .findByIdAndUpdate(request.params.id, person, {new: true})
    .then(updatedPerson => {
      response.json(formatPerson(updatedPerson))
    })
    .catch(error => {
      console.log(error)
      response.status(400).send({ error: 'malformatted id' })
    })
})

app.get('/', (req, res) => {
  res.send('<h1>Tervetuloa puhelinluetteloon</h1>')
})

app.get('/api/persons', (request, response) => {
  Person
    .find({__v: 0})
    .then(persons => {
      response.json(persons.map(formatPerson))
    })
})

app.get('/info', (request, response) => {
  let personMap = new Array()

  Person
    .find({})
    .then(result => {
      result.forEach(person => {
        personMap.push(person)
      })
      const output = `<p>puhelinluettelossa ${personMap.length} henkilön tiedot</p>
        <p>${new Date()}</p>`
      response.send(output)
    })
})

app.get('/api/persons/:id', (request, response) => {
  Person
    .findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(formatPerson(person))
      } else {
        response.status(404).end()
      }
    })
    .catch(error => {
      console.log(error)
      response.status(400).send({ error: 'malformatted id' })
    })
})

app.delete('/api/persons/:id', (request, response) => {
  Person
    .findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => {
      response.status(400).send({ error: 'malformatted id' })
    })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

const error = (request, response) => {
  response.status(404).send({error: 'unknown endpoint'})
}

app.use(error)
