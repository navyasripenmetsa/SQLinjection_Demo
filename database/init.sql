CREATE DATABASE vuln_ecommerce;
USE vuln_ecommerce;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50),
    password VARCHAR(255),
    role VARCHAR(20),
    email VARCHAR(100)
);

CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    description TEXT,
    price DECIMAL(10,2),
    category VARCHAR(50)
);

CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    product_id INT,
    quantity INT,
    total_price DECIMAL(10,2),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    product_id INT,
    comment TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE attack_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45),
    user_id INT,
    endpoint VARCHAR(255),
    attack_type VARCHAR(50),
    payload TEXT,
    status VARCHAR(20)
);

INSERT INTO users (username, password, role, email) VALUES
('admin', 'admin123', 'admin', 'admin@test.com'),
('user1', 'pass123', 'user', 'user1@test.com'),
('user2', 'pass123', 'user', 'user2@test.com');

INSERT INTO products (name, description, price, category) VALUES
('Phone', 'Smartphone', 10000, 'Electronics'),
('Laptop', 'Gaming laptop', 50000, 'Electronics'),
('Shoes', 'Running shoes', 2000, 'Fashion');

INSERT INTO orders (user_id, product_id, quantity, total_price) VALUES
(1, 1, 1, 10000),
(2, 2, 1, 50000),
(3, 3, 2, 4000);