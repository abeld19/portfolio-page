# Create the database
CREATE DATABASE IF NOT EXISTS myportfolio;
USE myportfolio;

DROP TABLE IF EXISTS contacts;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS myproject;

# Create the users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,           
    username VARCHAR(255) NOT NULL,        
    email VARCHAR(255) UNIQUE NOT NULL,           
    password VARCHAR(255) NOT NULL,              
    first_name VARCHAR(100) NOT NULL,                      
    last_name VARCHAR(100) NOT NULL                      
);
#create the table for the contact form
CREATE TABLE contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,             
    user_id INT,                                   
    name VARCHAR(255) NOT NULL,                     
    email VARCHAR(255) NOT NULL,                    
    message TEXT NOT NULL,                           
    FOREIGN KEY (user_id) REFERENCES users(id)     
);

# Create the projects table
CREATE TABLE myproject (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    features TEXT NOT NULL,
    technology TEXT NOT NULL
);

# Create the app user
CREATE USER IF NOT EXISTS 'myportfolio_app'@'localhost' IDENTIFIED BY 'tigray'; 
GRANT ALL PRIVILEGES ON myportfolio.* TO 'myportfolio_app'@'localhost';
