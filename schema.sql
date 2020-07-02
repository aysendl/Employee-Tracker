DROP DATABASE IF EXISTS employees_DB;
CREATE DATABASE employees_DB;

USE employees_DB;

CREATE TABLE department(
    id INT AUTO_INCREMENT NOT NULL, 
    name VARCHAR(30) NOT NULL,
    PRIMARY KEY(id)
); 


CREATE TABLE role(
    id INT AUTO_INCREMENT NOT NULL, 
    title VARCHAR(30) NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INT NOT NULL,
    PRIMARY KEY(id)
); 

CREATE TABLE employee(
    id INT AUTO_INCREMENT NOT NULL, 
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT NOT NULL,  
    manager_id INT,
    PRIMARY KEY(id)
); 

INSERT INTO department (name) VALUES ("Engineering");
INSERT INTO department (name) VALUES ("Accounting");
INSERT INTO role (title, salary, department_id) VALUES ("Manager", 100000, 1);
INSERT INTO role (title, salary, department_id) VALUES ("Engineer", 70000, 1);
INSERT INTO role (title, salary, department_id) VALUES ("Financial Analyst", 60000, 2);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Ayse", "Dal", 1, NULL);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Volkan", "Basar", 2, 1);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Dobby", "DB", 3, NULL);
