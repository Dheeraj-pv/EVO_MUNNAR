const express = require('express');
const router = express.Router();
const controller = require('./core_controller');

// Define routes
router.get('/', controller.getHome);
router.get('/api', controller.getApi);
router.post('/register', controller.register);
router.post('/login', controller.login);

module.exports = router;