const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  const { title} = request.query;
  const results = title ? repositories.filter( repo => repo.title.includes(title)) : repositories;
  return response.json(results);
});

app.post("/repositories", (request, response) => {
  
  const {id, url, title, techs} = request.body;
    const repo = { id: id != null ? id : uuid(), url, title, techs, likes: 0};
    repositories.push(repo);
    return response.json(repo);

});

app.put("/repositories/:id", (request, response) => {
  const {id} = request.params;
  const { url, title, techs} = request.body;
  const repoIndex = repositories.findIndex(repo => repo.id == id);
  
  if(repoIndex < 0){
      return response.status(400).json({error: "Repository not found"});
  }
  
  const likes = repositories[repoIndex].likes;
  const updatedRepo = {id, url, title, techs, likes};
  repositories[repoIndex]= updatedRepo;

  return response.json(updatedRepo);
});

app.delete("/repositories/:id", (request, response) => {
  const {id} = request.params;
  const repoIndex = repositories.findIndex(repo => repo.id == id);
  
  if(repoIndex < 0){
      return response.status(400).json({error: "Repository not found"});
  }

  repositories.splice(repoIndex, 1);
  return response.status(204).json();
});

app.post("/repositories/:id/like", (request, response) => {
  const {id} = request.params;
  const repoIndex = repositories.findIndex(repo => repo.id == id);
  
  if(repoIndex < 0){
    return response.status(400).json({error: "Repository not found"});
  }
  
  const oldRepo = repositories[repoIndex];
  const {title, url, techs, likes}  = oldRepo;
  const updatedRepo = {id, url, title, techs, likes: likes+1};
  repositories[repoIndex]= updatedRepo;

  return response.json(updatedRepo);
});

module.exports = app;
