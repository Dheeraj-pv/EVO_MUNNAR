const express = require('express');
const router = express.Router();
const controller = require('./core_controller');
const { requireAuth, redirectIfLoggedIn } = require('./auth_middleware');

// Define routes
router.get('/', requireAuth, controller.getHome);
router.get('/api', requireAuth, controller.getApi);
router.get('/login', redirectIfLoggedIn, controller.renderLoginPage);
router.get('/register', redirectIfLoggedIn, controller.renderRegisterPage);
router.post('/register', controller.register);
router.post('/login', controller.login);
router.post('/logout', requireAuth, controller.logout);
router.get('/check-auth', requireAuth, controller.checkAuth);
router.get('/get_allTaxiDetails', requireAuth, controller.get_allTaxiDetails);
router.get('/get_allHotelDetails', requireAuth, controller.get_allHotelDetails);
router.get('/bill', requireAuth, controller.renderBill);

module.exports = router;