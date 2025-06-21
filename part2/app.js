const express = require('express');
const path = require('path');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const db = require('./models/db');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(session({
    secret: '123',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 86400000 }
}));


// Route to return list of all dogs
app.get('/api/dogs', async (req, res) => {
    try {
        const [dogs] = await db.execute(`
            SELECT name AS dog_name, size, username AS owner_username
            FROM Dogs INNER JOIN Users ON Dogs.owner_id = Users.user_id
        `);
        res.json(dogs);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch dogs'});
    }
});


// Routes
const indexRoutes = require('./routes/index');
const walkRoutes = require('./routes/walkRoutes');
const userRoutes = require('./routes/userRoutes');

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRoutes);
app.use('/api/walks', walkRoutes);
app.use('/api/users', userRoutes);

// Export the app instead of listening here
module.exports = app;
