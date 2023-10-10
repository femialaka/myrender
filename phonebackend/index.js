const express = require("express")
const app = express()
const morgan = require('morgan')
const cors = require('cors')
		
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

const allowedOrigins = ['http://localhost:5173', 'https://domain2.com', 'https://domain3.com'];

const corsOptions = {
  origin: function (origin, callback) {
    // Check if the origin of the incoming request is in the allowedOrigins array
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

app.use(cors(corsOptions))
app.use(express.json())
//app.use(morgan('tiny'))

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
]

const generateId = () => {
  const maxId = persons.length > 0 ? Math.max(...persons.map((n) => n.id)) : 0
  return maxId + 1
}


app.post("/api/persons", (request, response) => {
  const body = request.body
  const nameExists = persons.find((person) => person.name.toLowerCase() === body.name.toLowerCase())

  console.log(nameExists)

  if(nameExists) {
    return response.status(400).json({
      error: "name must be unique",
    })
  }

  if (!body.name) {
    return response.status(400).json({
      error: "name missing",
    })
  }
  if (!body.number) {
    return response.status(400).json({
      error: "phone number missing",
    })
  }

  const personAdded = {
    name: body.name,
    number: body.number,
    id: generateId(),
  }

  persons = persons.concat(personAdded)

  response.json(persons)
})

app.get("/api/persons", (req, res) => {
  res.json(persons)
})

app.get("/info", (req, res) => {
  res.send(
    `<p>Phonebook has info for ${
      persons.length
    } people</p><p>${Date().toString()}</p>`
  )
})

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete("/api/person/:id", (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter((person) => person.id !== id)

  response.status(204).end()
})

app.post("/api/persons", (request, response) => {
  const person = request.body
  console.log(person)
  response.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
});