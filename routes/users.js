const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;
const { check, validationResult } = require('express-validator');

// Route to display the registration page
router.get('/register', (req, res) => {
    res.render('register.ejs', { errors: [] });
});

// Route to display the login page
router.get('/login', (req, res) => {
    res.render('login.ejs', { user: req.session.userId, errors: [] });
});

// Route to handle user registration
router.post('/register', [
    check('username').not().isEmpty().withMessage('Username is required'),
    check('email').isEmail().withMessage('Valid email is required'),
    check('password').not().isEmpty().withMessage('Password is required'),
    check('first_name').not().isEmpty().withMessage('First name is required'),
    check('last_name').not().isEmpty().withMessage('Last name is required')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).render('register.ejs', { errors: errors.array() });
    }

    const { username, email, password, first_name, last_name } = req.body;
    // Hash the password with salt rounds
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const query = 'INSERT INTO users (username, email, password, first_name, last_name) VALUES (?, ?, ?, ?, ?)';
    req.db.query(query, [username, email, hashedPassword, first_name, last_name], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.redirect('./login');
    });
});

// Route to handle user login
router.post('/login', [
    check('username').not().isEmpty().withMessage('Username is required'),
    check('password').not().isEmpty().withMessage('Password is required')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).render('login.ejs', { errors: errors.array() });
    }

    const { username, password } = req.body;
    const db = req.db;

    // Query to find the user by username
    db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).send('Internal server error');
        }

        if (results.length === 0) {
            return res.status(401).render('login.ejs', { errors: [{ msg: 'Invalid username or password' }] });
        }

        const user = results[0];

        // Compare the provided password with the stored hashed password
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                console.error('Error comparing passwords:', err);
                return res.status(500).send('Internal server error');
            }

            if (!isMatch) {
                return res.status(401).render('login.ejs', { errors: [{ msg: 'Invalid username or password' }] });
            }

            // Set the session userId
            req.session.userId = user.id;
            res.redirect('/');
        });
    });
});

// Route to handle user logout
router.get('/logout', (req, res) => {
    req.session.regenerate(err => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.redirect('./login');
    });
});

module.exports = router;
