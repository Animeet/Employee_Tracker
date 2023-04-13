const mysql = require('mysql2');
const inquirer = require('inquirer');
require("console.table")

const connection = mysql.createConnection({
    user: 'root',
    password: '',
    database: 'employee_tracker_db',
    host: 'localhost'
});

const questions = [
    // Initial Inquirer Prompts
    {
        type: "list",
        message: "What would you like to do?",
        name: "choices",
        choices: [
            "View All Employees",
            "Add Employee",
            "Update Employee Role",
            "View All Roles",
            "Add Role",
            "View All Departments",
            "Add Department"
        ]
    }
];



/* * * View All Employees * * */
function viewAllEmployees() {
    connection.query(`SELECT e1.id, e1.first_name, e1.last_name, title, salary, name AS department, CONCAT(e2.first_name, ' ', e2.last_name) AS manager FROM employee e1 
    JOIN role ON e1.role_id = role.id 
    JOIN department ON role.department_id = department.id 
    LEFT JOIN employee e2 ON e1.manager_id = e2.id`, function (err, results, fields) {
        if (err) {
            console.log(err);
            return;
        }
        console.table(results);
        init();
    });
}



/* * * Add Employee * * */
function addEmployee() {
    connection.query(`SELECT * FROM role`, function (err, results) {

        const roleChoices = results.map(function (role) {
            return {
                name: role.title,
                value: role.id
            };
        })

        connection.query(`SELECT * FROM employee`, function (err, results) {

            const managerChoice = results.map(function (manager) {
                return {
                    name: manager.first_name + ' ' + manager.last_name,
                    value: manager.id
                }
            })
            inquirer.prompt([
                {
                    type: "input",
                    message: "What is the employee's first name?",
                    name: "f_name"
                },
                {
                    type: "input",
                    message: "What is the employee's last name?",
                    name: "l_name"
                },
                {
                    type: "list",
                    message: "What is the employee's role?",
                    name: "role_id",
                    choices: roleChoices
                },
                {
                    type: "list",
                    message: "Who is the employee's manager?",
                    name: "manager_id",
                    choices: managerChoice
                }
            ]).then(function (data) {
                connection.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id)
            VALUES ("${data.f_name}", "${data.l_name}", ${data.role_id}, ${data.manager_id})`, function (err, results, fields) {
                    if (err) {
                        console.log(err);
                        return;
                    }

                    init();
                });
            })
        })
    })
}



/* * * Update Employee * * */
function updateEmployee() {
    connection.query(`SELECT * FROM role`, function (err, results) {

        const roleChoices = results.map(function (role) {
            return {
                name: role.title,
                value: role.id
            };
        })

        connection.query(`SELECT * FROM employee`, function (err, results) {

            const employeeChoices = results.map(function (employee) {
                return {
                    name: employee.first_name + ' ' + employee.last_name,
                    value: employee.id
                }
            })
            inquirer.prompt([
                {
                    type: "list",
                    message: "Which employee's role do you want to update?",
                    name: "employee_id",
                    choices: employeeChoices
                },
                {
                    type: "list",
                    message: "Which role do you want to assign the selected employee?",
                    name: "role_id",
                    choices: roleChoices
                }
            ]).then(function (data) {
                connection.query(`UPDATE employee SET role_id = ${data.role_id} WHERE id = ${data.employee_id}`, function (err, results, fields) {
                    if (err) {
                        console.log(err);
                        return;
                    }

                    init();
                });
            })
        })
    })
};



/* * * View All Roles * * */
function viewAllRoles() {
    connection.query(`SELECT role.id, title, name AS department, salary FROM role 
    JOIN department ON role.department_id = department.id `, function (err, results, fields) {
        if (err) {
            console.log(err);
            return;
        }
        console.table(results);
        // console.table(results);
        init();
    });
}



/* * * Add Roles * * */
function addRole() {
    connection.query(`SELECT * FROM department`, function (err, results) {

        const departmentChoices = results.map(function (department) {
            return {
                name: department.name,
                value: department.id
            };
        })
        inquirer.prompt([
            {
                type: "input",
                message: "What is the name of the role?",
                name: "role_name"
            },
            {
                type: "number",
                message: "What is the salary of the role?",
                name: "salary"
            },
            {
                type: "list",
                message: "Which department does the role belong to?",
                name: "department",
                choices: departmentChoices
            }
        ]).then(function (data) {
            connection.query(`INSERT INTO role (title, salary, department_id)
        VALUES ("${data.role_name}", "${data.salary}", "${data.department}")`, function (err, results, fields) {
                if (err) {
                    console.log(err);
                    return;
                }

                init();
            });
        })
    })
}



/* * * View All Departments * * */
function viewAllDepartments() {
    connection.query(`SELECT id, name FROM department`, function (err, results, fields) {
        if (err) {
            console.log(err);
            return;
        }
        console.table(results);
        init();
    });
}



/* * * Add Department * * */
function addDepartment() {
    inquirer.prompt([
        {
            type: "input",
            message: "What is the name of the department?",
            name: "department_name"
        },
    ]).then(function (data) {
        connection.query(`INSERT INTO department (name)
        VALUES ("${data.department_name}")`, function (err, results, fields) {
            if (err) {
                console.log(err);
                return;
            }

            init();
        });
    })
}



// TODO: Create a function to initialize app
function init() {

    inquirer.prompt(questions).then(function (data) {
        if (data.choices === "View All Employees") {
            viewAllEmployees()
        }
        else if (data.choices === "Add Employee") {
            addEmployee()
        }
        else if (data.choices === "Update Employee Role") {
            updateEmployee()
        }
        else if (data.choices === "View All Roles") {
            viewAllRoles()
        }
        else if (data.choices === "Add Role") {
            addRole()
        }
        else if (data.choices === "View All Departments") {
            viewAllDepartments();
        }
        else if (data.choices === "Add Department") {
            addDepartment();
        }
        // init();
    })
};


// Function call to initialize app
init();




/*
GIVEN a command-line application that accepts user input
WHEN I start the application
THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role

WHEN I choose to view all departments
THEN I am presented with a formatted table showing department names and department ids

WHEN I choose to view all roles
THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role

WHEN I choose to view all employees
THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to

WHEN I choose to add a department
THEN I am prompted to enter the name of the department and that department is added to the database

WHEN I choose to add a role
THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database

WHEN I choose to add an employee
THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database

WHEN I choose to update an employee role
THEN I am prompted to select an employee to update and their new role and this information is updated in the database
*/