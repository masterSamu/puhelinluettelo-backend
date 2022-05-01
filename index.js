require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");

morgan.token("body", function (req, res) {
  return JSON.stringify(req.body);
});

const app = express();

app.use(express.json());
app.use(express.static("build"));
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);
app.use(cors());

app.get("/", (request, response) => {
  response.send("<p>This is phonebook app. Watch <a href=/info>info</a></p>");
});

app.get("/info", (request, response, next) => {
  Person.count({})
    .then((count) => {
      response.send(`<p>Phonebook has info for ${count} people</p>
    <p>${new Date()}</p>
    `);
    })
    .catch((error) => next(error));
});

app.get("/api/persons", (request, response, next) => {
  Person.find({})
    .then((persons) => {
      response.json(persons);
    })
    .catch((error) => next(error));
});

app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

app.post("/api/persons", (request, response, next) => {
  const { name, number } = request.body;
  if (name === undefined) {
    return response.status(400).json({ error: "Name missing" });
  }
  if (number === undefined) {
    return response.status(400).json({ error: "Number missing" });
  }

  // Validating if person already exists
  Person.findOne({ name: name })
    .then((result) => {
      if (result !== null) {
        response
          .status(400)
          .json({ error: `Name '${name}' already exists in phonebook` });
      }
    })
    .catch((error) => {
      next(error);
    });

  const person = new Person({
    name: name,
    number: number,
  });

  person
    .save()
    .then((savedPerson) => {
      response.json(savedPerson);
    })
    .catch((error) => {
      console.error(error.name);
      next(error);
    });
});

app.put("/api/persons/:id", (request, response, next) => {
  const { name, number } = request.body;

  if (name === undefined) {
    return response.status(400).json({ error: "Name missing" });
  }
  if (number === undefined) {
    return response.status(400).json({ error: "Number missing" });
  }

  const person = {
    name: name,
    number: number,
  };

  Person.findByIdAndUpdate(request.params.id, person, {
    new: true,
    runValidators: true,
    context: "query",
  })
    .then((updatedPerson) => {
      response.json(updatedPerson);
    })
    .catch((error) => next(error));
});

const errorHandler = (error, request, response, next) => {
  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }
  next(error);
};

app.use(errorHandler);

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};
// This has to be after all endpoints!
app.use(unknownEndpoint);

const PORT = process.env.PORT;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
