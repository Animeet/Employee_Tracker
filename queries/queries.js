class Queries {
    static selectEmployees = `SELECT e1.first_name, e1.last_name, title, salary, name FROM employee e1 
    JOIN role ON e1.role_id = role.id 
    JOIN department ON role.department_id = department.id 
    LEFT JOIN employee e2 ON e1.manager_id = e2.id`
    
}

module.exports = Queries;