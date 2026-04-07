-- ── Flashcard App — Seed Data ────────────────────────────────────────────────
-- 20 sample flashcards across three categories: Python, Web, and Databases.
-- Run automatically by Docker on first start, or manually:
--   mysql -u flashcard_user -p flashcard_db < database/seed.sql
-- ─────────────────────────────────────────────────────────────────────────────

USE flashcard_db;

INSERT INTO flashcards (question, answer, category) VALUES

-- ── Python ───────────────────────────────────────────────────────────────────
('What is a Python decorator?',
 'A function that wraps another function to extend its behaviour without modifying it. Applied with the @syntax above a function definition.',
 'Python'),

('What is the difference between a list and a tuple in Python?',
 'Lists are mutable (can be changed after creation); tuples are immutable. Tuples are generally faster and used for fixed collections of items.',
 'Python'),

('What does the `__init__` method do in a Python class?',
 'It is the constructor — called automatically when a new instance is created. Used to initialise instance attributes.',
 'Python'),

('What is a Python generator?',
 'A function that uses `yield` to return values one at a time, lazily. It does not build the full list in memory, making it memory-efficient for large sequences.',
 'Python'),

('What is the difference between `==` and `is` in Python?',
 '`==` compares values (equality); `is` compares identity (same object in memory). Two equal objects can have different identities.',
 'Python'),

('What is list comprehension in Python?',
 'A concise syntax for creating lists: `[expr for item in iterable if condition]`. More readable and often faster than an equivalent for-loop.',
 'Python'),

('What does `*args` and `**kwargs` mean in a function signature?',
 '`*args` collects extra positional arguments as a tuple; `**kwargs` collects extra keyword arguments as a dictionary.',
 'Python'),

-- ── Web Development ───────────────────────────────────────────────────────────
('What is the difference between GET and POST HTTP methods?',
 'GET retrieves data and is idempotent; parameters go in the URL. POST sends data in the request body, typically to create or submit something.',
 'Web'),

('What is CORS and why is it needed?',
 'Cross-Origin Resource Sharing — a browser security policy that blocks web pages from making requests to a different domain. Servers must explicitly allow origins via response headers.',
 'Web'),

('What is REST?',
 'Representational State Transfer — an architectural style for APIs using HTTP methods (GET, POST, PUT, DELETE) to operate on resources identified by URLs.',
 'Web'),

('What is the purpose of the `Content-Type` header?',
 'It tells the receiver the media type of the request or response body (e.g. `application/json`, `text/html`), so it knows how to parse the data.',
 'Web'),

('What is the difference between 4xx and 5xx HTTP status codes?',
 '4xx errors indicate a client mistake (e.g. 400 Bad Request, 404 Not Found, 401 Unauthorised). 5xx errors indicate a server-side failure (e.g. 500 Internal Server Error).',
 'Web'),

('What is a JWT?',
 'JSON Web Token — a compact, URL-safe token encoding a payload (usually user identity/claims) signed with a secret or private key. Used for stateless authentication.',
 'Web'),

('What does "stateless" mean in the context of HTTP?',
 'Each request is self-contained — the server does not retain any memory of previous requests from the same client. All required state must be sent with every request.',
 'Web'),

-- ── Databases ────────────────────────────────────────────────────────────────
('What is a primary key?',
 'A column (or set of columns) that uniquely identifies each row in a table. Values must be unique and not NULL.',
 'Databases'),

('What is the difference between INNER JOIN and LEFT JOIN?',
 'INNER JOIN returns only rows with matching values in both tables. LEFT JOIN returns all rows from the left table plus matching rows from the right (NULLs where no match).',
 'Databases'),

('What is database normalisation?',
 'The process of organising a database to reduce redundancy and improve data integrity. Normal forms (1NF, 2NF, 3NF) define progressively stricter rules.',
 'Databases'),

('What is an index in a database?',
 'A data structure (usually a B-tree) that speeds up lookups on a column by avoiding full table scans. Speeds up reads but slightly slows writes.',
 'Databases'),

('What is the difference between SQL and NoSQL databases?',
 'SQL databases store structured data in tables with a fixed schema and use relational joins. NoSQL databases (document, key-value, graph) are schema-flexible and optimised for specific access patterns.',
 'Databases'),

('What is ACID in database transactions?',
 'Atomicity (all-or-nothing), Consistency (valid state before and after), Isolation (concurrent transactions do not interfere), Durability (committed data persists). These properties guarantee reliable transactions.',
 'Databases');
