const pool = require('./db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; 

// Controller functions
const getHome = (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
};

const getApi = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1 as test');
    res.status(200).json({
      message: 'Database connection successful',
      status: 'success',
      status_code: 200,
      data: rows
    });
  } catch (err) {
    console.error('Database query error:', err);
    res.status(500).json({
      message: 'Database connection failed',
      status: 'failure',
      status_code: 500,
      data: { error: err.message }
    });
  }
};

const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required',
        status: 'failure',
        status_code: 400,
        data: null
      });
    }

    // Check if user already exists
    const [existingUser] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      return res.status(409).json({
        message: 'User already exists',
        status: 'failure',
        status_code: 409,
        data: null
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const [result] = await pool.query('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword]);

    res.status(201).json({
      message: 'User registered successfully',
      status: 'success',
      status_code: 201,
      data: { userId: result.insertId }
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({
      message: 'Registration failed',
      status: 'failure',
      status_code: 500,
      data: { error: err.message }
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required',
        status: 'failure',
        status_code: 400,
        data: null
      });
    }

    // Find user
    const [users] = await pool.query('SELECT id, email, password FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(401).json({
        message: 'Invalid credentials',
        status: 'failure',
        status_code: 401,
        data: null
      });
    }

    const user = users[0];

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        message: 'Invalid credentials',
        status: 'failure',
        status_code: 401,
        data: null
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Set token as cookie (expires in 24 hours)
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    res.status(200).json({
      message: 'Login successful',
      status: 'success',
      status_code: 200,
      data: { token, user: { id: user.id, email: user.email } }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({
      message: 'Login failed',
      status: 'failure',
      status_code: 500,
      data: { error: err.message }
    });
  }
};

const renderLoginPage = (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
};

const renderRegisterPage = (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'register.html'));
};

const logout = (req, res) => {
  res.clearCookie('token');
  res.status(200).json({
    message: 'Logout successful',
    status: 'success',
    status_code: 200,
    data: null
  });
};

const get_allTaxiDetails = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT taxi_id AS id, name, model, vh_number, availability, rate FROM taxi WHERE availability = "yes"');
    res.status(200).json({
      message: 'Taxi details retrieved successfully',
      status: 'success',
      status_code: 200,
      data: rows
    });
  } catch (err) {
    console.error('Get taxi details error:', err);
    res.status(500).json({
      message: 'Failed to retrieve taxi details',
      status: 'failure',
      status_code: 500,
      data: { error: err.message }
    });
  }
};

const get_allHotelDetails = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT hotel_id, name, type, capacity_children, capacity_adults, rate, description, amenities FROM hotel');
    res.status(200).json({
      message: 'Hotel details retrieved successfully',
      status: 'success',
      status_code: 200,
      data: rows
    });
  } catch (err) {
    console.error('Get hotel details error:', err);
    res.status(500).json({
      message: 'Failed to retrieve hotel details',
      status: 'failure',
      status_code: 500,
      data: { error: err.message }
    });
  }
};

const checkAuth = (req, res) => {
  res.status(200).json({
    message: 'User authenticated',
    status: 'success',
    status_code: 200,
    data: { user: req.user }
  });
};

const renderBill = (req, res) => {
  const { pickup, dropoff, rate, distance, total } = req.query;
  res.render('bill', { pickup, dropoff, rate, distance, total });
};

module.exports = {
  getHome,
  getApi,
  register,
  login,
  logout,
  checkAuth,
  get_allTaxiDetails,
  get_allHotelDetails,
  renderBill,
  renderLoginPage,
  renderRegisterPage
};