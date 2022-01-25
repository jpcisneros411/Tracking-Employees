const mysql = require("mysql");
const inquirer = require("inquirer");

//const employee = require("./eployee_db")


const connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "rootroot",
    database: "eployee_db"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    main();
});

const selection = [

    {
        type: "list",
        name: "selection",
        message: "What would you like to to?",
        choices: [
            "Add new employee",
            "View all employees",
            "View employees by department",
            "Update employee role",
            "View all roles",
            "Add new role",
            "View all departments",
            "Add department",
            "Delete employee",
            "Delete role",
            "Delete department",
            "Exit"
        ]
    }
]


function main() {
    inquirer.prompt(selection).then(answers => {
        switch (answers.selection) {
            case 'Add new employee':
                addEmployee();
                break;
            case 'View all employees':
                viewAllEmployees();
                break;
            case 'View employees by department':
                viewByDep();
                break;
            case 'View all roles':
                viewAllRoles();
                break;
            case 'Add new role':
                addNewRole();
                break;
            case 'View all departments':
                viewAllDep();
                break;
            case 'Add department':
                addDepartment();
                break;
            case 'Update employee role':
                updateRole();
                break;
            case 'Delete employee':
                deleteEmployee();
                break;
            case 'Delete role':
                deleteRole();
                break;
            case 'Delete department':
                deleteDepartment();
                break;
            default:
                connection.end();
                break;
        }
    });
}

// Create functions

function addEmployee() {
    inquirer.prompt([
        {
            type: "input",
            name: "first_name",
            message: "Enter in the employee's first name."
        },
        {
            type: "input",
            name: "last_name",
            message: "Enter in the employee's last name"
        },
        {
            type: "number",
            name: "role_id",
            message: "Enter the employee's role ID"
        },
        {
            type: "number",
            name: "manager_id",
            message: "Enter the employee's manager ID"
        },

    ]).then(function (answers) {

        let query = "INSERT INTO employee SET ?"
        connection.query(query, [answers], function (err) {
            if (err) throw err;
            console.table("Success, employee added!")
            main();
        });

    });
}


function addDepartment() {
    inquirer.prompt([
        {
            type: "input",
            name: "dept_name",
            message: "Select the Department you would like to add."
        }
    ]).then(function (answers) {

        let query = "INSERT INTO department SET?"
        // console.log(query)
        connection.query(query, [answers], function (err) {
            if (err) throw err;
            console.table("Success, you added a Department!")
            main();
        });
    });
}

function addNewRole() {
    inquirer.prompt([
        {
            type: "title",
            name: "input",
            message: "Enter the employee's title."
        },
        {
            type: "number",
            name: "salary",
            message: "Enter in the employee's salary."
        },
        {
            type: "number",
            name: "department_id",
            message: "Enter the Department ID for this employee's role?"
        },

    ]).then(function (answers) {
        let query = "INSERT INTO roles SET ?"
        connection.query(query, [answers], function (err) {
            if (err) throw err;
            console.table("Success, a new Role was created!");
            main();
        });
    });
}

// View functions

function viewAllEmployees() {
    connection.query(
        "SELECT employee.first_name, employee.last_name, roles.title, roles.salary, department.dept_name, manager.first_name AS 'manager_first_name', manager.last_name AS 'manager_last_name' FROM employee LEFT JOIN roles ON employee.role_id = roles.id LEFT JOIN department ON roles.department_id = department.id  LEFT JOIN employee manager ON employee.manager_id = manager.id; ",
        function (err, res) {
            console.table(res);
            if (err) throw err;
            main();
        });
}

function viewAllRoles() {
    connection.query("SELECT roles.title, roles.salary, department.dept_name FROM roles LEFT JOIN department ON roles.department_id = department.id;",
        function (err, res) {
            if (err) throw err;
            console.table(res);
            main();
        });

}

function viewByDep() {
    connection.query("SELECT * FROM department", function (err, res) {
        if (err) throw err;
        console.table(res);
        main();
    });
};

// Update functions

function updateRole() {
    connection.query("SELECT * FROM employee", function (err, res) {
        if (err) throw err;
        console.log(res);
        const employee = res.map(element => {
            return (
                {
                    name: element.first_name + element.last_name,
                    value: element.id
                }
            )
        })
        console.log(employee);
        connection.query("SELECT * FROM employee", function (err, res1) {
            if (err) throw err;
            console.log(res1);
            const roles = res.map(element => {
                return (
                    {
                        name: element.role_id,
                        value: element.id
                    }
                )
            })
            console.log(roles);

            inquirer.prompt([
                {
                    type: "list",
                    name: "employee",
                    message: "Select the employee.",
                    choices: employee
                },
                {
                    type: "list",
                    name: "role",
                    message: "Select the employee's new role ID.",
                    choices: roles
                }
            ]).then(answers => {
                console.log(answers)
                connection.query("UPDATE employee SET role_id = ? WHERE id = ?", [answers.employee, answers.role],
                    function (err, res) {
                        if (err) throw err;
                        console.log(res.affectedRows + "Employee updated!\n");
                        main();
                    });
            });
        })
    })
}

// Delete functions

function deleteEmployee() {
    inquirer.prompt([
        {
            type: "number",
            name: "id",
            message: "Enter employee ID?"
        }
    ]).then(answers => {
        connection.query("DELETE FROM employee WHERE ?",
            {
                id: answers.id
            }, function (err, res) {
                if (err) throw err;
                console.log(res.affectedRows + "Success, Employee deleted!\n");
                main();
            })
    })
};
function deleteRole() {
    inquirer.prompt([
        {
            type: "number",
            name: "id",
            message: "Enter role ID?"
        }
    ]).then(answers => {
        connection.query("DELETE FROM employee WHERE ?",
            {
                id: answers.id
            }, function (err, res) {
                if (err) throw err;
                console.log(res.affectedRows + "Success Employee Role deleted!\n");
                main();

            });
    });
};

function deleteDepartment() {
    inquirer.prompt([
        {
            type: "number",
            name: "id",
            message: "Enter department ID?"
        }
    ]).then(answers => {
        connection.query("DELETE FROM department WHERE ?",
            {
                id: answers.id
            }, function (err, res) {
                if (err) throw err;
                console.log(res.affectedRows + "Department deleted!\n");
                main();
            });
    });
};