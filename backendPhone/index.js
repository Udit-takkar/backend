const express = require("express");
const app = express();
var fs = require("fs");
var morgan = require("morgan");
var path = require("path");

app.use(express.json());
// app.use(morgan("combined"));
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :content "
  )
);
let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendick",
    number: "39-23-6423122",
  },
  {
    id: 5,
    name: "udit",
    number: "9891",
  },
];

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);
  if (person) response.json(person);
  else {
    response.status(404).end();
  }
});

app.get("/info", (request, response) => {
  const d = new Date();
  response.send(
    `<h1>PhoneBook has info for ${persons.length} people</h1><br><h1>${d}</h1>`
  );
});

app.post("/api/persons", (request, response) => {
  const generateID = Math.floor(Math.random() * 1000);
  request.body = { id: generateID, name: "Jake", number: 123 };

  morgan.token("content", function (req, res) {
    return JSON.stringify(request.body);
  });

  // app.use(
  //   morgan(function (req, res, next) {
  //     console.log(status);
  //     next();
  //   })
  // );

  if (!("name" in request.body)) throw new Error("Enter a Name");
  else if (!("number" in request.body)) {
    throw new Error("Enter a Number");
  } else {
    const checkuniqueName = persons.some((person) => {
      return person.name === request.body.name;
    });
    if (checkuniqueName) throw new Error("Name must be Unique");
  }
  const person = request.body;
  response.json(person);
});

app.delete("/api/persons/del/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);
  response.status(204).end();
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
