
-- Insert Departments --
INSERT INTO department (name)
VALUES
    ("Pizza");


-- Insert Roles --
INSERT INTO role (title, salary, department_id)
VALUES
    ("pizza store manager", 250000, 1), 
    ("pizza Maker", 75000, 1);


-- Insert Employees --
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ("Zach", "Barnes", 1, NULL), 
    ('vinnie', 'lopez', 2, 1);