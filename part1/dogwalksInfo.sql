
USE DogWalkService;

INSERT INTO Users (username, email, password_hash, role)
VALUES
('alice123', 'alice@example.com', 'hashed123', 'owner'),
('bobwalker', 'bob@example.com', 'hashed456', 'walker'),
('carol123', 'carol@example.com', 'hashed789', 'owner'),
('david', 'david@example.com', 'hashed10', 'walker'),
('Alan', 'alan@example.com', 'faded11', 'walker');

INSERT INTO Dogs (owner_id, name, size)
SELECT user_id, 'Max', 'medium' FROM Users Where username = 'alice123' UNION ALL
SELECT user_id, 'Bella', 'small' FROM Users Where username = 'carol123' UNION ALL
SELECT user_id, 'Emma', 'large' FROM Users Where username = 'alice123' UNION ALL
SELECT user_id, 'Frank', 'medium' FROM Users Where username = 'alice123' UNION ALL
SELECT user_id, 'George', 'small' FROM Users Where username = 'alice123';

INSERT INTO WalkRequests (dog_id, requested_time, duration_minutes, location, status)
SELECT dog_id, '2025-06-10 08:00:00', '30', 'Parklands', 'open' FROM Dogs WHERE name = 'Max' UNION ALL
SELECT dog_id, '2025-06-10 09:30:00', '45', 'Beachside Ave', 'accepted' FROM Dogs WHERE name = 'Bella' UNION ALL
SELECT dog_id, '1970-01-01 00:00:00', '5', 'Moon', 'open' FROM Dogs WHERE name = 'Emma' UNION ALL
SELECT dog_id, '2025-06-11 10:00:00', '60', 'Rundle St', 'completed' FROM Dogs WHERE name = 'Frank' UNION ALL
SELECT dog_id, '2025-06-12 12:00:00', '15', 'Hub Central', 'completed' FROM Dogs WHERE name = 'Max';

INSERT INTO WalkApplications (request_id, walker_id, status)
VALUES
(4, 2, 'accepted'),
(5, 2, 'accepted');


INSERT INTO WalkRatings (request_id, walker_id, owner_id, rating)
VALUES
(4, 2, 1, 5),
(5, 2, 1, 4);



SELECT username AS walker_username, total_ratings, average_rating, completed_walks
    FROM (
        SELECT username, COUNT(rating) AS total_ratings, SUM(rating) / COUNT(rating) AS average_rating
        FROM Users
        LEFT OUTER JOIN WalkRatings ON WalkRatings.walker_id = Users.user_id
        WHERE role = 'walker'
        GROUP BY username
    ) sub1
    INNER JOIN (
        SELECT username, IFNULL(completed_walks, 0)
        FROM (
            SELECT walker_id, COUNT(*) AS completed_walks
            FROM WalkRequests
            INNER JOIN WalkApplications ON WalkApplications.request_id = WalkRequests.
        ) sub
        RIGHT OUTER JOIN Users ON Users.user_id = sub.walker_id
        WHERE role = 'walker'
    ) sub2
    WHERE sub1.username = sub2.username

