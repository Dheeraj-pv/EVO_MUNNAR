const express = require('express');
const router = require('./core_router');
const app = express();
const port = 3000;

// Middleware to parse JSON
app.use(express.json());

// Use the core router
app.use('/', router);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
