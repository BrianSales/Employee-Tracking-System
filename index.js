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
  choices: ["View all departments", "View all roles", "view all employees",
    "add a department", "add a role", "add an employee", "update employee roles", "end"]
}];

// Ask the question
function start (){
    inquirer.prompt(question)
  .then(answer => {
    if (answer.action === "View all departments") {
      connection.query('SELECT * FROM departments', function (err, departments) {
        console.table(departments);
      })

    } else if (answer.action === 'View all roles') {
      connection.query('SELECT * FROM roles', function (err, roles) {
        console.table(roles);
      })
    } else if (answer.action === 'add a role') {
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
        }

      ])
        .then(answer => {
          connection.query('insert into role (name) values(?)', [answer.department])
        })
    }


    else if (answer.action === 'add a department') {
      inquirer.prompt([
        {
          name: 'department',
          message: 'Enter the department name:',
          type: 'input'
        }
      ])
        .then(answer => {
          connection.query('insert into departments (name) values(?)', [answer.department])
        })
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