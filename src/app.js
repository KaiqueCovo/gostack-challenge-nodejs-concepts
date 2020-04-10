const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

/* Middleware check if repository exists */
function validateRepository(request, response, next) {
  const { id } = request.params

  const repository = repositories.find( repository => repository.id === id )

  /* Check if repository exists */
  if(!repository)
    return response.status(400).json({ error: 'Repository do not exists!' })

  request.repository = repository
  return next()
}

app.use('/repositories/:id', validateRepository)

const repositories = [];

app.get("/repositories", (request, response) => response.json(repositories));

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body

  const repository = { 
    id: uuid(), 
    title, 
    url, 
    techs, 
    likes: 0 
  }

  /* Add new repository */
  repositories.push(repository)

  return response.json(repository)
});

app.put("/repositories/:id", (request, response) => {
  const { title, url, techs } = request.body
  let { repository } = request

  /* Update the repository */
  repository = { ...repository, title, url, techs }

  return response.json(repository)
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params

  /* Delete the repository */
  const repositoryIndex = repositories.findIndex(repository => repository.id === id )
  repositories.splice(repositoryIndex, 1)

  return response.status(204).send()
});

app.post("/repositories/:id/like", (request, response) => {
  const { repository } = request

  /* Add like */
  repository.likes++

  return response.json(repository)
});

module.exports = app;
