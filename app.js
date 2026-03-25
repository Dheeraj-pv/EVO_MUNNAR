const express = require('express');
const cookieParser = require('cookie-parser');
const router = require('./core_router');
const app = express();
const port = 3000;

// Middleware to parse JSON and cookies
app.use(express.json());
app.use(cookieParser());

// Use the core router
app.use('/', router);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
