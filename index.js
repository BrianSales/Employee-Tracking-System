const inquirer = require("inquirer")
const mysql = require("mysql2")

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Sql26280!',
    database: 'employee_db'
});

let question = [{
    message: 'What do you want to do?',
    name: 'action',
    type: 'list',
    choices: ["View all departments", "View all roles", "View all employees",
        "add a department", "add a role", "add an employee", "update employee roles", "end"]
}];

function viewAllDepartments() {
    connection.query('SELECT * FROM departments', function (err, departments) {
        console.table(departments);
        start()
    });
}

function viewAllRoles() {
    connection.query('SELECT title, salary, name as Department FROM roles JOIN departments ON roles.department_id = departments.id', function (err, roles) {
        console.table(roles);
        start()
    })

}

function viewAllEmployees() {
    connection.query(`Select 
    employee.first_name, employee.last_name, title, salary,
    manager.first_name as manager from employees as employee
    JOIN roles ON employee.role_id = roles.id
    LEFT JOIN employees as manager ON
    employee.manager_id = manager.id`, function(err, employees) {
        console.table(employees);
        start();
    });

}

function addDepartment(){
    inquirer.prompt([
        {
            name: 'department',
            message: 'Enter the department name:',
            type: 'input'
        }
    ])
        .then(answer => {
            connection.query('insert into departments (name) values(?)', [answer.department])
            start()
        })
        

}

function addRole() {
    connection.query('Select * from departments', function (err, departments) {
        console.log(departments);
        const departmentsArr = [];
        departments.forEach(department => {
            departmentsArr.push(department.name);
        })
        inquirer.prompt([
            {
                name: 'title',
                message: 'Enter the job title:',
                type: 'input'

            },
            {
                name: "salary",
                message: "What is your salary",
                type: 'input',
            },
            {
                name: "department",
                message: 'Select the department this role belongs to',
                type: 'list',
                choices: departmentsArr
            }
        ])
            .then(answers => {
                let departmentId = 0;
                departments.forEach(department => {
                    if (department.name === answers.department) {
                        departmentId = department.id;
                    }
                })
                connection.query('insert into roles (title, salary, department_id) values(?, ?, ?)', [answers.title, answers.salary, departmentId])
                start();
            })
    })
}

function addEmployee(){
    connection.query('Select id, title from roles', function (err, roles){
        const rolesArr = [];
        roles.forEach(role => {
            rolesArr.push(role.title);
        })
        inquirer.prompt([
            {
                name: 'title',
                message: 'Enter the job title:',
                type: 'input'

            },
            {
                name: "salary",
                message: "What is your salary",
                type: 'input',
            },
            {
                name: "department",
                message: 'Select the department this role belongs to',
                type: 'list',
                choices: departmentsArr
            }
        ])



    })
}

// Ask the question
function start() {
    inquirer.prompt(question)
        .then(answer => {
            if (answer.action === "View all departments") {
                viewAllDepartments();
            } else if (answer.action === 'View all roles') {
                viewAllRoles();

            } else if (answer.action === 'View all employees'){
                viewAllEmployees();
            } 
            else if (answer.action === 'add a role') {
                addRole();

            } else if(answer.action === 'add an employee'){
                addEmployee();
            }


            else if (answer.action === 'add a department') {
                addDepartment();
            } 

            

            else {
                console.log("Goodbye")
                connection.end();

            }




        })

}
// connect to the mysql server and sql database
connection.connect((err) => {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    start();
});