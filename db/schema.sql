DROP DATABASE IF EXISTS employee_tracker_db;


-- Create the Employee Tracker Database --
CREATE DATABASE employee_tracker_db;
USE employee_tracker_db;


-- Create Department Table --
CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50)
);


-- Create Role Table --
CREATE TABLE role (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(50),
    salary DECIMAL,
    department_id INT NOT NULL, 
    FOREIGN KEY (department_id) REFERENCES department(id)
    );


-- Create Employee Table --
CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(25),
    last_name VARCHAR(25),
    role_id INT NOT NULL, 
    FOREIGN KEY (role_id) REFERENCES role(id),
    manager_id INT,
    FOREIGN KEY (manager_id) REFERENCES employee(id)
);
