INSERT INTO Users (username, email, password_hash, role)
VALUES
('alice123', 'alice@example.com', 'hashed123', 'owner'),
('bobwalker', 'bob@example.com', 'hashed456', 'walker'),
('carol123', 'carol@example.com', 'hashed789', 'owner'),
('david', 'david@example.com', 'hashed10', 'walker'),
('Alan', 'alan@example.com', 'faded11', 'walker');


INSERT INTO Dogs (owner_id, name, size)
SELECT
user_id, 'Max', 'medium' FROM Users Where username = 'alice123',
user_id, 'Bella', 'small' FROM Users Where username = 'carol123',
user_id, 'Emma', 'large' FROM Users Where username = 'bobwalker',
user_id, 'Frank', 'medium' FROM Users Where username = 'david',
user_id, ''