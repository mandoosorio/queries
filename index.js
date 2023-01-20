const mysql = require('mysql2')
const { prompt } = require('inquirer')
require('console.table')
//const { prototype } = require('events');
const queries = require('./db/index')

init();

function init() {
  loadInitialQuestions()
}

function loadInitialQuestions() {
  prompt([
    {
      type: 'list',
      name: 'action',
      massage: 'What would you like to do?',
      choices: [
        {
          name: 'View all departments',
          value: 'VIEW_DEPARTMENTS',
        },
        {
          name: 'add a department',
          value: 'ADD_DEPARTMENT',
        },
      ],
    },
  ]).then((choice) => {
    let response = choice.action

    switch (response) {
      case 'VIEW_DEPARTMENTS':
        viewDepartments()
        break
      case 'ADD_DEPARTMENT':
        addDepartment()
        break

      default:
        break
    }
  })
}

function viewDepartments() {
  queries.viewDepartments().then(([rows, fields]) => {
    console.table(rows)
  })
}

function viewEmployees() {
    queries.findAllEmployees()
      .then(([rows]) => {
        let employees = rows;
        console.log("\n");
        console.table(employees);
      })
      .then(() => loadMainPrompts());
}
  

  
  function removeEmployee() {
    queries.findAllEmployees()
      .then(([rows]) => {
        let employees = rows;
        const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
          name: `${first_name} ${last_name}`,
          value: id
        }));
  
        prompt([
          {
            type: "list",
            name: "employeeId",
            message: "Which employee do you want to remove?",
            choices: employeeChoices
          }
        ])
          .then(res => queries.removeEmployee(res.employeeId))
          .then(() => console.log("Removed employee from the database"))
          .then(() => loadMainPrompts())
      })
  }
  
  function updateEmployeeRole() {
    queries.findAllEmployees()
      .then(([rows]) => {
        let employees = rows;
        const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
          name: `${first_name} ${last_name}`,
          value: id
        }));
  
        prompt([
          {
            type: "list",
            name: "employeeId",
            message: "Which employee's role do you want to update?",
            choices: employeeChoices
          }
        ])
          .then(res => {
            let employeeId = res.employeeId;
            queries.findAllRoles()
              .then(([rows]) => {
                let roles = rows;
                const roleChoices = roles.map(({ id, title }) => ({
                  name: title,
                  value: id
                }));
  
                prompt([
                  {
                    type: "list",
                    name: "roleId",
                    message: "Which role do you want to assign the selected employee?",
                    choices: roleChoices
                  }
                ])
                  .then(res => queries.updateEmployeeRole(employeeId, res.roleId))
                  .then(() => console.log("Updated employee's role"))
                  .then(() => loadMainPrompts())
              });
          });
      })
  }

  
  function viewRoles() {
    queries.findAllRoles()
      .then(([rows]) => {
        let roles = rows;
        console.log("\n");
        console.table(roles);
      })
      .then(() => loadMainPrompts());
  }
  
  function addRole() {
    queries.findAllDepartments()
      .then(([rows]) => {
        let departments = rows;
        const departmentChoices = departments.map(({ id, name }) => ({
          name: name,
          value: id
        }));
  
        prompt([
          {
            name: "title",
            message: "What is the name of the role?"
          },
          {
            name: "salary",
            message: "What is the salary of the role?"
          },
          {
            type: "list",
            name: "department_id",
            message: "Which department does the role belong to?",
            choices: departmentChoices
          }
        ])
          .then(role => {
            queries.createRole(role)
              .then(() => console.log(`Added ${role.title} to the database`))
              .then(() => loadMainPrompts())
          })
      })
  }
  
 
  function viewDepartments() {
    queries.findAllDepartments()
      .then(([rows]) => {
        let departments = rows;
        console.log("\n");
        console.table(departments);
      })
      .then(() => loadMainPrompts());
  }
  
  function addDepartment() {
    prompt([
      {
        name: "name",
        message: "What is the name of the department?"
      }
    ])
      .then(res => {
        let name = res;
        queries.createDepartment(name)
          .then(() => console.log(`Added ${name.name} to the database`))
          .then(() => loadMainPrompts())
      })
  }
  
 

  function addEmployee() {
    prompt([
      {
        name: "first_name",
        message: "What is the employee's first name?"
      },
      {
        name: "last_name",
        message: "What is the employee's last name?"
      }
    ])
      .then(res => {
        let firstName = res.first_name;
        let lastName = res.last_name;
  
        db.findAllRoles()
          .then(([rows]) => {
            let roles = rows;
            console.log(roles); // should be an array

            /*const roleChoices = roles.map(({ id, title }) => ({
              name: title,
              value: id
            }));*/

            var roleChoices = [];
            for (let i = 0; i < roles.length; i++) {
                var obj = {
                    name: roles[i].title,
                    value: roles[i].id
                }
                roleChoices.push(obj);
            }

            console.log(roleChoices);
  
            prompt({
              type: "list",
              name: "roleId",
              message: "What is the employee's role?",
              choices: roleChoices
            })
              .then(res => {
                let roleId = res.roleId;
                // you have first, last, and role saved
  
                db.findAllEmployees()
                  .then(([rows]) => {
                    let employees = rows;

                    /*const managerChoices = employees.map(({ id, first_name, last_name }) => ({
                      name: `${first_name} ${last_name}`,
                      value: id
                    }));*/

                    var managerChoices = [];
                    for (let i = 0; i < employees.length; i++) {
                        var obj = {
                            name: employess[i].first_name + employees[i].last_name,
                            value: employees[i].id
                        }
                        managerChoices.push(obj);
                    }
  
                    prompt({
                      type: "list",
                      name: "managerId",
                      message: "Who is the employee's manager?",
                      choices: managerChoices
                    })
                      .then(res => {
                        let employee = {
                          manager_id: res.managerId,
                          role_id: roleId,
                          first_name: firstName,
                          last_name: lastName
                        }
  
                        db.createEmployee(employee);
                      })
                      .then(() => console.log(
                        `Added user to the database`
                      ))
                      .then(() => loadMainPrompts())
                  })
              })
          })
      })
  }
  
  function quit() {
    process.exit();
  }