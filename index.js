// Import required modules
var express = require('express');
var ejs = require('ejs');
var mysql = require('mysql2');
var session = require('express-session');
var validator = require('express-validator');
var expressSanitizer = require('express-sanitizer');
const axios = require('axios'); 

// Initialise the Express application
const app = express();
const port = 8000; 

// Set up EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views'); 

// Use express-sanitizer for sanitizing inputs
app.use(expressSanitizer());

// Body parser setup to handle form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); 

// Serve static files (CSS, JS) from public folder
app.use(express.static(__dirname + '/public'));

// Session setup for user authentication
app.use(session({
    secret: 'tigray1234', // Use a secure secret in production
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 600000 // Use maxAge instead of expires
    }
}));

// Define the database connection pool
const pool = mysql.createPool({
    host: 'localhost',
    user: 'myportfolio_app',
    password: 'tigray',
    database: 'myportfolio',
    waitForConnections: true,
    connectionLimit: 10, // Maximum number of connections
    queueLimit: 0
});

// Connect to the database pool
pool.getConnection((err, connection) => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to database');
    console.log('Database state:', connection.state);
    connection.release(); // Release the connection back to the pool
});

// Function to start the server
const startServer = (port) => {
    app.listen(port, (err) => {
        if (err) {
            if (err.code === 'EADDRINUSE') {
                console.error(`Port ${port} is already in use, trying another port...`);
                startServer(port + 1); // Try the next port
            } else {
                console.error('Failed to start server:', err);
            }
            return;
        }
        console.log(`Server is running on http://localhost:${port}`);
        console.log(`Listening on port ${port}`);
    });
};

// Start the web app listening on the configured port
startServer(port);

// Make the `pool` accessible to routers
app.use((req, res, next) => {
    req.db = pool; // Use pool-based connection
    next();
});

// Define application-specific data


// Middleware to check if the user is logged in
const requireLogin = (req, res, next) => {
    if (!req.session.userId) {
        console.log('User not logged in, redirecting to login'); // Log redirection to login
        return res.redirect('/users/login');
    }
    next();
};

// Load route handlers for different paths

// Public routes for login and registration
const usersRoutes = require('./routes/users');
app.use('/users', usersRoutes);

// Route to handle login form submission
app.post('/users/login', (req, res) => {
    const { username, password } = req.body;

    // Basic validation
    if (!username || !password) {
        return res.send("Username and password are required. Please <a href='/users/login'>try again</a>");
    }

    // Check credentials in the database
    const sql = "SELECT id FROM users WHERE username = ? AND password = ?";
    req.db.query(sql, [username, password], (err, results) => {
        if (err) {
            console.error('Error checking credentials:', err);
            return res.send('An error occurred while logging in. Please try again.');
        }
        if (results.length === 0) {
            return res.send("Invalid credentials. Please <a href='/users/login'>try again</a>");
        }

        // Set session userId
        req.session.userId = results[0].id;
        res.redirect('/');
    });
});

// Protected routes
const mainRoutes = require("./routes/main");
app.use('/', mainRoutes);

// Route to redirect to GitHub repositories page, login required
app.get('/api/github-repos', requireLogin, (req, res) => {
    console.log('Redirecting to GitHub repos page'); // Log the redirection
    res.redirect('https://github.com/abeld19?tab=repositories');
});