const express = require('express');
const fs = require('fs');
const authenticateJWT = require('../middleware/authenticateJWT');

const router = express.Router();
let repositories = JSON.parse(fs.readFileSync('repositories.json', 'utf8'));

// Allow unauthenticated users to view repositories
router.get('/', (req, res) => {
  res.json(repositories);
});

router.get('/:id', (req, res) => {
  const repository = repositories.find(repo => repo.id === req.params.id);
  if (repository) {
    res.json(repository);
  } else {
    res.status(404).send('Repository not found');
  }
});

// Require authentication for POST, PUT, DELETE operations
router.post('/', authenticateJWT, (req, res) => {
  const newRepository = req.body;
  repositories.push(newRepository);
  res.status(201).json(newRepository);
});

router.put('/:id', authenticateJWT, (req, res) => {
  const index = repositories.findIndex(repo => repo.id === req.params.id);
  if (index !== -1) {
    repositories[index] = req.body;
    res.json(repositories[index]);
  } else {
    res.status(404).send('Repository not found');
  }
});

router.delete('/:id', authenticateJWT, (req, res) => {
  const index = repositories.findIndex(repo => repo.id === req.params.id);
  if (index !== -1) {
    const deletedRepository = repositories.splice(index, 1);
    res.json(deletedRepository);
  } else {
    res.status(404).send('Repository not found');
  }
});

module.exports = router;