const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors()); // Allow cross-origin requests

// Example routes
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend connected successfully!' });
});

app.get('/api/users', (req, res) => {
  res.json({ users: ['John', 'Jane', 'Bob'] });
});

app.listen(PORT, () => {
  console.log(`Express server running on port ${PORT}`);
});