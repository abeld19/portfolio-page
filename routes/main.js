const express = require("express");
const router = express.Router();

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

// My Project page route
router.get('/myproject', (req, res) => {
    res.render('myproject.ejs', { user: req.session.userId });
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

router.get('/logout', (req, res) => {
    res.render('login.ejs', { user: req.session.userId, errors: [] });
});

router.get('/first', (req, res) => {
    const sql = "SELECT * FROM myproject WHERE name = 'abels portfolio'";
    req.db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching project:', err);
            return res.status(500).send('Internal Server Error');
        }
        if (results.length === 0) {
            return res.status(404).send('Project not found');
        }
        const project = results[0];
        res.render('first', { project, name: project.name });
    });
});

router.get('/second', (req, res) => {
    const sql = "SELECT * FROM myproject WHERE name = 'care compass'";
    req.db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching project:', err);
            return res.status(500).send('Internal Server Error');
        }
        if (results.length === 0) {
            return res.status(404).send('Project not found');
        }
        const project = results[0];
        res.render('second', { project, name: project.name });
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
        res.render('search_results.ejs', { user: req.session.userId, results });
    });
});

router.get('/search', (req, res, next) => {
    res.render("search.ejs", { user: req.session.userId });
});

router.get('/search_result', (req, res) => {
    const searchQuery = req.query.search;
    getSearchResults(req, searchQuery, (err, results) => {
        if (err) {
            console.error('Error performing search:', err);
            return res.send('An error occurred while performing the search. Please try again.');
        }
        res.render('search_results', { results });
    });
});

function getSearchResults(req, query, callback) {
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
            return callback(err, null);
        }
        callback(null, results);
    });
}

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

// Example route to fetch all projects
router.get('/projects', (req, res) => {
    req.db.query('SELECT * FROM myproject', (err, rows) => {
        if (err) {
            console.error('Database query failed:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.json(rows);
    });
});


module.exports = router;
