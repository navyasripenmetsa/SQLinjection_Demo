DROP DATABASE IF EXISTS sqli_demo_secure;
CREATE DATABASE sqli_demo_secure;
USE sqli_demo_secure;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'user',
    email VARCHAR(100) NOT NULL UNIQUE,
    last_processed DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price FLOAT NOT NULL,
    category VARCHAR(50)
);

CREATE TABLE attack_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(50),
    user_id INT NULL,
    endpoint VARCHAR(100),
    attack_type VARCHAR(50),
    payload TEXT,
    status VARCHAR(50)
);

CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    total_price FLOAT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    comment TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

INSERT INTO users (username, password, role, email, last_processed) VALUES
('admin', '$2b$12$HeHIela4xf1yiycmUSVbSOvFC2LAcyt3UegDdejGQLHYwNWDXLBRS', 'admin', 'admin@test.com', NOW()),
('user1', '$2b$12$HeHIela4xf1yiycmUSVbSOvFC2LAcyt3UegDdejGQLHYwNWDXLBRS', 'user', 'user1@test.com', NOW()),
('user2', '$2b$12$HeHIela4xf1yiycmUSVbSOvFC2LAcyt3UegDdejGQLHYwNWDXLBRS', 'user', 'user2@test.com', NOW());

INSERT INTO products (name, description, price, category) VALUES
('Headphones', 'Noise cancelling headphones', 5000, 'Electronics'),
('Smart Watch', 'Fitness tracking smartwatch', 7000, 'Electronics'),
('Backpack', 'Waterproof travel backpack', 1500, 'Fashion'),
('T-Shirt', 'Cotton casual t-shirt', 800, 'Fashion'),
('Jeans', 'Slim fit denim jeans', 1800, 'Fashion'),
('Coffee Maker', 'Automatic coffee machine', 4000, 'Home Appliances'),
('Blender', 'Kitchen blender with 3 jars', 2500, 'Home Appliances'),
('Book - Python', 'Learn Python programming', 600, 'Books'),
('Book - DBMS', 'Database management systems', 750, 'Books'),
('Office Chair', 'Ergonomic office chair', 9000, 'Furniture'),
('Table Lamp', 'LED study lamp', 1200, 'Furniture'),
('Keyboard', 'Mechanical gaming keyboard', 3500, 'Electronics'),
('Mouse', 'Wireless optical mouse', 1200, 'Electronics');

INSERT INTO orders (user_id, product_id, quantity, total_price) VALUES
(1, 1, 1, 5000),
(2, 2, 2, 14000),
(2, 4, 1, 800),
(3, 8, 3, 1800);

INSERT INTO reviews (user_id, product_id, comment) VALUES
(2, 1, 'Very good product.'),
(3, 2, 'Battery life is decent.'),
(2, 8, 'Useful for beginners.');
