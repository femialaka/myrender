const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

app.use(cors())
morgan.token('post-data', (req, res) => {
  if (req.method === 'POST' && req.body) {
    return JSON.stringify(req.body)
  }
  return '-'
})

app.use(
  morgan(
    ':method :url :status :res[content-length] - :response-time ms :post-data',
    {
      skip: function (req) {
        return req.method !== 'POST' // Log only POST requests
      },
    }
  )
)

app.use(express.json())
app.use(express.static('dist'))


let persons = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: 1,
  },
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: 2,
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: 3,
  },
  {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    id: 4,
  },
  {
    name: "Johnny Walker",
    number: "13-56-7879224",
    id: 5,
  },
];

const generateId = () => Math.ceil(Math.random() * 90000000)

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((person) => person.id === id);
  if (person) {
    res.json(person);
    //res.send(`<p>Phone: ${person.number}</p>`)
  } else {
    //res.send(`<p>404 Phone Number not found</p>`)
    res.status(404).end()
  }
});

app.get("/", (req, res) => {
  res.send(`<h3>Phonebook api</h3>`)
})
app.get("/info", (req, res) => {
  res.send(`<p>Phonebook has info for ${persons.length} people</p>
  <p>${Date()}</p>`)
});

app.get("/api/persons", (req, res) => {
  res.json(persons)
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find((person) => person.id === id)
  if (person) {
    persons = persons.filter(person => person.id !== id)
    res.status(204).end()
  } else {
    res.status(404).end()
  }
});

app.post("/api/persons", (request, response) => {
  const person = request.body

  if (!person.name) {
    return response.status(400).json({
      error: "name missing",
    })
  }
  if (!person.number) {
    return response.status(400).json({
      error: "phone number missing",
    })
  }

  const nameExists = persons.find((p) => p.name.toLowerCase() === person.name.toLowerCase())

  console.log(nameExists)

  if(nameExists) {
    return response.status(400).json({
      error: "name must be unique",
    })
  }

  const personAdded = {
    name: person.name,
    number: person.number,
    id: generateId(),
  }

  persons = persons.concat(personAdded)

  response.json(persons)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
});
