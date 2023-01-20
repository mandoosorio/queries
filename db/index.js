const connection = require('./db/connection')

class Queries {
  constructor(connection) {
    this.connection = connection
  }

  viewDepartments() {
    return this.connection
      .promise()
      .query('SELECT department.id, department.name FROM department')
  }

  findAllEmployees() {
    return this.connection.promise().query(`
    SELECT 
    employee.id, 
    employee.first_name, 
    employee.last_name, 
    
    role.title,
    departments.name AS department, 
    roles.salary, 
    manager.first_name AS manager

    FROM employee LEFT JOIN roles on employee.role_id = roles.id
    LEFT JOIN department on roles.department_id = departments.id
    LEFT JOIN employee manager on manger.id = employee.manager_id;
    `
    )
  }

  findAllRoles() {
    return this.connection.promise().query(
      `SELECT roles.id, roles.title, 
      department.name AS department, 
      roles.salary 

      FROM roles 
      LEFT JOIN department on roles.department_id = department.id;`
    );
  }
  
  findAllPossibleManagers(employeeId) {
    return this.connection.promise().query(
      "SELECT id, first_name, last_name FROM employee WHERE id != ?",
      employeeId
    );
  }

  createEmployee(employee) {
    return this.connection.promise().query("INSERT INTO employee SET ?", employee);
  }

  
  removeEmployee(employeeId) {
    return this.connection.promise().query(
      "DELETE FROM employee WHERE id = ?",
      employeeId
    );
  }

  updateEmployeeRole(employeeId, roleId) {
    return this.connection.promise().query(
      "UPDATE employee SET role_id = ? WHERE id = ?",
      [roleId, employeeId]
    );
  }

  findAllRoles() {
    return this.connection.promise().query(
      "SELECT roles.id, roles.title, department.name AS department, roles.salary FROM roles LEFT JOIN department on roles.department_id = department.id;"
    );
  }

  createRole(role) {
    return this.connection.promise().query("INSERT INTO roles SET ?", role);
  }

  removeRole(roleId) {
    return this.connection.promise().query("DELETE FROM roles WHERE id = ?", roleId);
  }

 
  findAllDepartments() {
    return this.connection.promise().query(
      "SELECT departments.id, departments.name FROM department;"
    );
  }

  createDepartment(department) {
    return this.connection.promise().query("INSERT INTO department SET ?", department);
  }

  
  removeDepartment(departmentId) {
    return this.connection.promise().query(
      "DELETE FROM department WHERE id = ?",
      departmentId
    );
  }


}

module.exports = new Queries(connection)