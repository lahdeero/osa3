const express = require('express')
const app = express()
const bodyParser = require('body-parser')
var morgan  = require('morgan')

morgan.token('type', function (req, res) { return JSON.stringify(req.body) })

app.use(bodyParser.json())
app.use(morgan(':method :url :type :status :res[content-length] - :response-time ms'))

let persons = [
  {
    name: 'Arto Hellas',
    number: '040-123123',
    id: 1,
  },
  {
    name: 'Martti Tienari',
    number: '040-123123',
    id: 2,
  },
  {
    name: 'Arto Järvinen',
    number: '040-123123',
    id: 3,
  },
  {
    name: 'Lea Kutvonen',
    number: '040-321321',
    id: 4,
  },
  {
    name: 'Testi Henkilö',
    number: '050-1111111',
    id: 5,
  }
]

const generateId = () => {
  const maxId = persons.length > 0 ? persons.map(n => n.id).sort().reverse()[0] : 1
  return maxId + 1
}
const generateDate = () => {
  let today = new Date()
  return today
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (body.name === undefined) {
    return response.status(400).json({error: 'name missing'})
  } else if (persons.find(person => person.name === body.name)) {
    return response.status(400).json({error: 'name must be unique'})
  }
  
  if (body.number === undefined) {
    return response.status(400).json({error: 'number missing'})
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId()
  }

  persons = persons.concat(person)

  response.json(person)
})


app.get('/', (req, res) => {
  res.send('<h1>Tervetuloa puhelinluetteloon</h1>')
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/info', (request, response) => {
  const lkm = persons.length
  const date = generateDate()
  const output = `<p>puhelinluettelossa ${lkm} henkilön tiedot</p>
    <p>${date}</p>`
  response.send(output)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(note => note.id === id)

  if (person) {
    response.json( person )
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

const error = (request, response) => {
  response.status(404).send({error: 'unknown endpoint'})
}

app.use(error)
