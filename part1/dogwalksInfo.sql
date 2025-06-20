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
SELECT user_id, 'Emma', 'large' FROM Users Where username = 'bobwalker' UNION ALL
SELECT user_id, 'Frank', 'medium' FROM Users Where username = 'david' UNION ALL
SELECT user_id, 'George', 'small' FROM Users Where username = 'alice123';

INSERT INTO WalkRequests (dog_id, requested_time, duration_minutes, location, status)
SELECT dog_id, '2025-06-10 08:00:00', '30', 'Parklands', 'open' FROM Dogs WHERE name = 'Max' UNION ALL
SELECT dog_id, '2025-06-10 09:30:00', '45', 'Beachside Ave', 'accepted' FROM Dogs WHERE name = 'Bella' UNION ALL
SELECT dog_id, '1970-01-01 00:00:00', '5', ''



