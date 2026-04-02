const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const router = require('./core_router');
const app = express();
const port = 3000;

// Load environment variables from .env file
require('dotenv').config();

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware to parse JSON and cookies
app.use(express.json());
app.use(cookieParser());

// Use the core router
app.use('/', router);

// Serve static files from dist folder (built React app) - AFTER router to allow auth checks
app.use(express.static(path.join(__dirname, 'dist')));

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
