const express = require("express");
const router = express.Router();
const axios = require("axios");
require("dotenv").config();

const repoOwner = 'abeld19';

// Custom sanitization function
function sanitize(input) {
    return input.replace(/<[^>]*>?/gm, '');
}

// Middleware to define req.sanitize and req.db
router.use((req, res, next) => {
    req.sanitize = sanitize;
    next();
});

// Home page route
router.get('/', (req, res) => {
    res.render('index', { user: req.session.userId });
});

// Contacts page route
router.get('/contacts', (req, res) => {
    res.render('contacts.ejs', { user: req.session.userId });
});

// Route to handle the contact form submission
router.post('/contact', (req, res, next) => {
    const { name, email, message } = req.body;
    
    // Basic validation
    if (!name || !email || !message) {
        return res.send("All fields are required. Please <a href='/contacts'>try again</a>");
    }
    
    // Insert contact message into the database
    const sql = "INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)";
    const record = [req.sanitize(name), req.sanitize(email), req.sanitize(message)];
    
    req.db.query(sql, record, (err, result) => {
        if (err) {
            console.error('Error inserting contact message:', err);
            return res.send('An error occurred while submitting your message. Please try again.');
        }
        res.send('Thank you for your message! We will get back to you soon.');
    });
});

// My Project page route
router.get('/myproject', (req, res) => {
    res.render('myproject.ejs', { user: req.session.userId });
});

// Route to display the first project details
router.get('/first', async (req, res) => {
    const sql = "SELECT * FROM myproject WHERE name = 'abels portfolio'";
    req.db.query(sql, async (err, results) => {
        if (err) {
            console.error('Error fetching project:', err);
            return res.status(500).send('Internal Server Error');
        }
        if (results.length === 0) {
            return res.status(404).send('Project not found');
        }
        const project = results[0];

        const repoName = 'front-end-project';
        const url = `https://api.github.com/repos/${repoOwner}/${repoName}/commits`;

        const response = await axios.get(url, {
            headers: {
                'Accept': 'application/vnd.github+json',
                'Authorization': `Bearer ${process.env.GITHUB_TOKEN}` 
            }
        });

        const lastCommit = response.data[0];
        const lastCommitDate = `Last updated on ${new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(new Date(lastCommit.commit.author.date))}`;

        res.render('first', { project, lastCommitDate });
    });
});

// Route to display the second project details
router.get('/second', async (req, res) => {
    const sql = "SELECT * FROM myproject WHERE name = 'care compass'";
    req.db.query(sql, async (err, results) => {
        if (err) {
            console.error('Error fetching project:', err);
            return res.status(500).send('Internal Server Error');
        }
        if (results.length === 0) {
            return res.status(404).send('Project not found');
        }
        const project = results[0];
        const repoName = 'HealthApp';
        const url = `https://api.github.com/repos/${repoOwner}/${repoName}/commits`;

        const response = await axios.get(url, {
            headers: {
                'Accept': 'application/vnd.github+json',
                'Authorization': `Bearer ${process.env.GITHUB_TOKEN}` 
            }
        });

        const lastCommit = response.data[0];
        const lastCommitDate = `Last updated on ${new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(new Date(lastCommit.commit.author.date))}`;
        
        res.render('second', { project, lastCommitDate });
    });
});

// Route to handle the search form submission
router.post('/search', (req, res, next) => {
    const { query } = req.body;
    
    // Basic validation
    if (!query) {
        return res.send("Search query is required. Please <a href='/search'>try again</a>");
    }
    
    // Perform search in the database and render the results
    const sql = `
    SELECT * FROM myproject 
    WHERE name LIKE ? 
    OR description LIKE ? 
    OR features LIKE ? 
    OR technology LIKE ?
    `;
    const searchQuery = `%${req.sanitize(query)}%`;
    
    req.db.query(sql, [searchQuery, searchQuery, searchQuery, searchQuery], (err, results) => {
        if (err) {
            console.error('Error performing search:', err);
            return res.send('An error occurred while performing the search. Please try again.');
        }
        project = results[0];
        if (project === undefined) {
            res.send('Project not found <a href="/myproject">Back to My Projects</a>');
        } else {
            if (project.name === 'Abels portfolio') {
                res.redirect('first');
            }
            else if (project.name === 'Care Compass') {
                res.redirect('second');
            }
            else {
                // send project not found and a link to the myproject page
                res.send('Project not found <a href="/myproject">Back to My Projects</a>');
            }
        }
    });
});

// Public API to get the list of projects
router.get('/api/myprojects', (req, res) => {
    const sql = "SELECT * FROM myproject";
    req.db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching projects:', err.message);
            return res.status(500).json({ error: 'An error occurred while fetching projects.' });
        }
        res.json(results);
    });
});

// Route to display the login page
router.get('/login', (req, res) => {
    res.render('login.ejs', { user: req.session.userId, errors: [] });
});

// Route to handle user logout
router.get('/logout', (req, res) => {
    res.render('login.ejs', { user: req.session.userId, errors: [] });
});

module.exports = router;
