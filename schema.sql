DROP DATABASE IF EXISTS eployee_db;

CREATE DATABASE eployee_db;

USE eployee_db;

CREATE TABLE department (
id INT NOT NULL AUTO_INCREMENT,
dept_name VARCHAR(30),
PRIMARY KEY(id)
);

CREATE TABLE roles (
id INT NOT NULL AUTO_INCREMENT,
title VARCHAR(30),
salary DECIMAL,
department_id INT,
PRIMARY KEY(id)
);

CREATE TABLE employee (
id INT NOT NULL AUTO_INCREMENT,
first_name VARCHAR(30),
last_name VARCHAR(30),
role_id INT, 
manager_id INT,
PRIMARY KEY (id)
);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Jason", "Cisneros", "30", "0023"), ("Paulina", "Gamboa", "29", "1134"), ("Otis", "CG", "45", "4593"),("Oliver", "CG", "28", "6782"), ("Rudy", "CG", "73", "98734"),("Phoebe", "CG", "22", "1026");

SELECT roles.title, roles.salary, department.dept_name FROM roles
LEFT JOIN department
ON roles.department_id = department.id; 


INSERT INTO department (dept_name)
VALUES ("Purchasing"), ("IT"), ("Human Resources");

INSERT INTO roles (title, salary, department_id)
VALUES ("Admin", "1000", 1), ("Contract", "2000", 2), ("Manager","3000", 3);

SELECT employee.first_name, employee.last_name, roles.title, roles.salary, department.dept_name, manager.first_name AS manager_firstname, manager.last_name AS manager_lastname FROM employee
LEFT JOIN roles 
ON employee.role_id = roles.id
LEFT JOIN department
ON roles.department_id = department.id
LEFT JOIN employee manager 
ON employee.manager_id = manager.id;