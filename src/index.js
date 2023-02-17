const express = require("express");
const cors = require("cors");

const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
  const { username } = request.headers;

  const user = users.find((user) => user.username === username);

  if (!!user) {
    request.user = user;
    return next();
  }

  return response.status(404).json({ error: "user not found" });
}

app.post("/users", (request, response) => {
  // Complete aqui
  const { name, username } = request.body;

  if (!!users.find((user) => user.username === username))
    return response.status(400).json({ error: "Usuario ja criado" });

  const user = {
    id: uuidv4(),
    name,
    username,
    todos: [],
  };

  users.push(user);
  return response.status(201).json(user);
});

app.get("/todos", checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  return response.status(200).json(user.todos);
});

app.post("/todos", checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const {
    body: { title, deadline },
    user
  } = request;

  const todo = {
    id: uuidv4(),
    title,
    done: false,
    deadline,
    created_at: new Date(),
  };


  user.todos.push(todo);

  return response.status(201).json(todo);
});

app.put("/todos/:id", checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const {
    body: { title, deadline },
    user,
  } = request;

  const todo = user.todos.find((todo) => todo.id === request.params.id);

  if (!todo) return response.status(404).json({ error: "Not Found" });

  todo.title = title;
  todo.deadline = new Date(deadline);

  return response.status(200).json(todo);
});

app.patch("/todos/:id/done", checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const {
    user
  } = request;

  const todo = user.todos.find((todo) => todo.id === request.params.id);

  if (!todo) return response.status(404).json({ error: "Not Found" });

  todo.done = true;

  return response.status(200).json(todo);
});

app.delete("/todos/:id", checksExistsUserAccount, (request, response) => {
  const {
    user,
    params: { id },
  } = request;

  const todoIndex = user.todos.findIndex((todo) => todo.id === id);

  if (todoIndex === -1)
    return response.status(404).json({ error: "Not Found" });

  user.todos.splice(todoIndex, 1);

  return response.status(204).json();
});

module.exports = app;
