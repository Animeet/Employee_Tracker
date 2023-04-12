const mysql = require('mysql2');
const inquirer = require('inquirer');
const Queries = require('./queries/queries.js');
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

function viewAllEmployees () {
    connection.query(`SELECT e1.first_name, e1.last_name, title, salary, name FROM employee e1 
    JOIN role ON e1.role_id = role.id 
    JOIN department ON role.department_id = department.id 
    LEFT JOIN employee e2 ON e1.manager_id = e2.id`, function (err, results, fields) {
        console.table(results);
        init();
    });
}

function addEmployee () {
    connection.query(`SELECT * FROM role`, function (err, results) {
        console.log(results)

        const roleChoices = results.map(function(role){
            return {
                name: role.title,
                value: role.id
            };
        })
    connection.query(`SELECT * FROM employee`, function (err, results) {
        console.log(results);

        const managerChoice = results.map(function(manager){
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
               if(err) {
                console.log(err);
                return;
               }
               console.log(results);
               init();
            });
        })
    })

        // const roleChoices = results;
        
    })
}


// TODO: Create a function to initialize app
function init() {

    inquirer.prompt(questions).then(function (data) {
        if (data.choices === "View All Employees") {
            viewAllEmployees()
        };
        if (data.choices === "Add Employee") {
            addEmployee()
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