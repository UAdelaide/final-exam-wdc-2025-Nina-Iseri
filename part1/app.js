var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mysql = require('mysql2/promise');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var apiRouter = require('./routes/api');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

let db;

(async () => {
    try {
      // Connect to MySQL without specifying a database
      const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '' // Empty password
      });

      // Create the database if it doesn't exist
      await connection.query(`
            DROP DATABASE IF EXISTS DogWalkService;
        `);
      await connection.query(`
            CREATE DATABASE DogWalkService;
        `);
      await connection.end();

      // Now connect to the created database
      db = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'DogWalkService'
      });

      // Create tables
      await db.execute(`
        CREATE TABLE Users (
            user_id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(50) UNIQUE NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            role ENUM('owner', 'walker') NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      await db.execute(`
        CREATE TABLE Dogs (
            dog_id INT AUTO_INCREMENT PRIMARY KEY,
            owner_id INT NOT NULL,
            name VARCHAR(50) NOT NULL,
            size ENUM('small', 'medium', 'large') NOT NULL,
            FOREIGN KEY (owner_id) REFERENCES Users(user_id)
        )
      `);
      await db.execute(`
        CREATE TABLE WalkRequests (
            request_id INT AUTO_INCREMENT PRIMARY KEY,
            dog_id INT NOT NULL,
            requested_time DATETIME NOT NULL,
            duration_minutes INT NOT NULL,
            location VARCHAR(255) NOT NULL,
            status ENUM('open', 'accepted', 'completed', 'cancelled') DEFAULT 'open',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (dog_id) REFERENCES Dogs(dog_id)
        )
      `);
      await db.execute(`
        CREATE TABLE WalkApplications (
            application_id INT AUTO_INCREMENT PRIMARY KEY,
            request_id INT NOT NULL,
            walker_id INT NOT NULL,
            applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            status ENUM('pending', 'accepted', 'rejected') DEFAULT 'pending',
            FOREIGN KEY (request_id) REFERENCES WalkRequests(request_id),
            FOREIGN KEY (walker_id) REFERENCES Users(user_id),
            CONSTRAINT unique_application UNIQUE (request_id, walker_id)
        )
      `);
      await db.execute(`
        CREATE TABLE WalkRatings (
            rating_id INT AUTO_INCREMENT PRIMARY KEY,
            request_id INT NOT NULL,
            walker_id INT NOT NULL,
            owner_id INT NOT NULL,
            rating INT CHECK (rating BETWEEN 1 AND 5),
            comments TEXT,
            rated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (request_id) REFERENCES WalkRequests(request_id),
            FOREIGN KEY (walker_id) REFERENCES Users(user_id),
            FOREIGN KEY (owner_id) REFERENCES Users(user_id),
            CONSTRAINT unique_rating_per_walk UNIQUE (request_id)
        )
      `);

      // Insert data
      await db.execute(`
        INSERT INTO Users (username, email, password_hash, role)
        VALUES
        ('alice123', 'alice@example.com', 'hashed123', 'owner'),
        ('bobwalker', 'bob@example.com', 'hashed456', 'walker'),
        ('carol123', 'carol@example.com', 'hashed789', 'owner'),
        ('david', 'david@example.com', 'hashed10', 'walker'),
        ('Alan', 'alan@example.com', 'faded11', 'walker')
      `);
      await db.execute(`
        INSERT INTO Dogs (owner_id, name, size)
        SELECT user_id, 'Max', 'medium' FROM Users Where username = 'alice123' UNION ALL
        SELECT user_id, 'Bella', 'small' FROM Users Where username = 'carol123' UNION ALL
        SELECT user_id, 'Emma', 'large' FROM Users Where username = 'bobwalker' UNION ALL
        SELECT user_id, 'Frank', 'medium' FROM Users Where username = 'david' UNION ALL
        SELECT user_id, 'George', 'small' FROM Users Where username = 'alice123'
      `);
      await db.execute(`
        INSERT INTO WalkRequests (dog_id, requested_time, duration_minutes, location, status)
        SELECT dog_id, '2025-06-10 08:00:00', '30', 'Parklands', 'open' FROM Dogs WHERE name = 'Max' UNION ALL
        SELECT dog_id, '2025-06-10 09:30:00', '45', 'Beachside Ave', 'accepted' FROM Dogs WHERE name = 'Bella' UNION ALL
        SELECT dog_id, '1970-01-01 00:00:00', '5', 'Moon', 'open' FROM Dogs WHERE name = 'Emma' UNION ALL
        SELECT dog_id, '2025-06-11 10:00:00', '60', 'Rundle St', 'accepted' FROM Dogs WHERE name = 'Frank' UNION ALL
        SELECT dog_id, '2025-06-12 12:00:00', '15', 'Hub Central', 'cancelled' FROM Dogs WHERE name = 'Max'
      `);
    } catch (err) {
      console.error('Error setting up database. Ensure Mysql is running: service mysql start', err);
    }
  })();

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

// Route to return all open walk requests
app.get('/api/walkrequests/:status', async (req, res) => {
    let status = req.params.status || '';
    if (status != 'open') {
        return res.status(400).json({ error: 'Invalid walkrequest status'});
    }
    try {
        const [walk_requests] = await db.execute(`
            SELECT request_id, name AS dog_name, requested_time, duration_minutes, location, username AS owner_username
            FROM WalkRequests
            INNER JOIN Dogs ON 

        `);
        res.json(walk_requests);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch '})
    }
});

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api', apiRouter);

module.exports = app;
