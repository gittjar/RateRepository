const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const cors = require('cors'); 
const fs = require('fs');
const path = require('path');
const authenticateJWT = require('./middleware/authenticateJWT');
const repositoryRoutes = require('./routes/repositories');
const moment = require('moment-timezone');
const secretKey = process.env.SECRET_KEY;

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(bodyParser.json());
app.use(cors()); // Use the cors middleware

const users = [
  { id: 1, username: 'user1', password: 'password1' },
  { id: 2, username: 'user2', password: 'password2' }
];

// Load repositories data
const filePath = path.join(__dirname, 'repositories.json');
let repositories = JSON.parse(fs.readFileSync(filePath, 'utf8'));
console.log('Loaded repositories:', repositories);

// Local time with timezone
app.get('/time', (req, res) => {
  const { timezone } = req.query;
  const options = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit' 
  };
  const localTime = moment().tz(timezone).format('LLLL');
  res.json({ time: localTime });
});

// Login route
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    const accessToken = jwt.sign({ username: user.username, id: user.id }, process.env.SECRET_KEY);
    res.json({ accessToken });
  } else {
    res.send('Username or password incorrect');
  }
});

// User likelist feature
let userLikelists = {}; // Store user likelists in memory

// Hard-code adding repositories to a specific user's likelist when the server starts
userLikelists[1] = ['jaredpalmer.formik', 'rails.rails']; // Use user ID 1

console.log('Initial user likelists:', userLikelists);

app.post('/likelist/:id', authenticateJWT, (req, res) => {
  const userId = req.user.id;
  const repositoryId = req.params.id;

  if (!userLikelists[userId]) {
    userLikelists[userId] = [];
  }

  if (!userLikelists[userId].includes(repositoryId)) {
    userLikelists[userId].push(repositoryId);
  }

  res.status(200).json({ message: 'Repository added to likelist', likelist: userLikelists[userId] });
});

app.get('/likelist', authenticateJWT, (req, res) => {
  const userId = req.user.id;
  const userLikelist = userLikelists[userId] || [];
  console.log('User likelist:', userLikelist);

  const likedRepositories = repositories.filter(repo => userLikelist.includes(repo.id));
  console.log('Liked repositories:', likedRepositories);

  res.json(likedRepositories);
});

app.delete('/likelist/:id', authenticateJWT, (req, res) => {
  const userId = req.user.id;
  const repositoryId = req.params.id; // The repo name like 'rails.rails'

  console.log(`User ${userId} attempting to delete repository ${repositoryId}`);

  if (!userLikelists[userId]) {
    console.log('Likelist not found for user:', userId);
    return res.status(404).json({ message: 'Likelist not found for user' });
  }

  userLikelists[userId] = userLikelists[userId].filter(repo => repo !== repositoryId);

  console.log('Updated likelist for user:', userId, userLikelists[userId]);

  res.status(200).json({ message: 'Repository removed from likelist', likelist: userLikelists[userId] });
});

// Use repository routes
app.use('/repositories', repositoryRoutes);

app.get('/', (req, res) => {
  res.send(`Hello World! Secret Key: ${secretKey}`);
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});