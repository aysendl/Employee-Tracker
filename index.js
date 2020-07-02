 const connection = require("./db/connection");
 const inquirer = require("inquirer");
 const cTable = require('console.table');

 const questions = [
    {
        name:"View Employees",
        value:"ViewEmp"
    },
    {
        name:"View Departments",
        value:"ViewDept"
    },
    {
        name:"View Roles",
        value:"ViewRol"
    },
    {
        name:"Add Employee",
        value:"AddEmp"
    },
    {
        name:"Add Department",
        value:"AddDept"
    },
    {
        name:"Add Role",
        value:"AddRol"
    },
    {
        name:"Update Employee Role",
        value:"UpdtRol"
    }
 ]
function viewMainQuestions(){
    inquirer.prompt([
        {
            message:"What do you want to do?",
            type:"list",
            name:"option",
            choices:questions
        }
    ]).then((response)=>{
        console.log('\n');
        if (response.option == "ViewEmp"){
            viewEmployee()
        }
        else if(response.option == "ViewDept"){
            viewDepartment()
        }
        else if(response.option == "ViewRol"){
            viewRole()
        }
        else if(response.option == "AddEmp"){
           addEmployee()
        }
        else if(response.option == "AddDept"){
            addDepartment()
        }
        else if(response.option == "AddRol"){
            addRole()
        }
        else if(response.option == "UpdtRol"){
           updateEmployeeRoles()
        }
    })
}

function addDepartment(){
    inquirer.prompt([
        {
            message:"What is the department's name?",
            type:"input",
            name:"departmentName"
        }  
    ]).then((response)=>{
        connection.query("INSERT INTO department(name) VALUES(?)",response.departmentName, (err,result)=>{
            if(err) throw err;
            console.log("Inserted as ID"+result.insertId);
        });
        viewMainQuestions()
    })
}

function addRole(){
    connection.query("SELECT * FROM department", (err,results) =>{
        if(err) throw err;
        inquirer.prompt([
            {
                message:"What is the title?",
                type:"input",
                name:"title"
        
            },
            {
                message:"What is the salary?",
                type:"input",
                name:"salary",
                validate: (value) => {
                    return !isNaN(value) ? true : "Please provide a number value.";
                }
            },
            {
                message:"What is the department does the role belong to",
                type:"list",
                name:"department_id",
                choices: results.map(department =>{
                    return{
                        name:department.name,
                        value:department.id
        
                    };
                })
            }
        ]).then((response)=>{
            connection.query("INSERT INTO role SET ?", response, (err,result)=>{
                if(err) throw err;
                console.log("Inserted as ID"+result.insertId);
            });
            viewMainQuestions()
        });
    });
}

function addEmployee() {

   getRoles((roles) =>{
        getEmployees((employees)=>{
            
            employeeSelections=employees.map(employee =>{
            return{
                name:employee.first_name + ' ' +employee.last_name,
                value:employee.id
            };
        });
        employeeSelections.unshift({name: "None", value: null});
        inquirer.prompt([
            {
                message:"First Name?",
                type:"input",
                name:"first_name"
            },
            {
                message:"Last Name?",
                type:"input",
                name:"last_name" 
            },
            {
                message:"Role?",
                type:"list",
                name:"role_id",
                choices: roles.map(role =>{
                    return{
                        name:role.title ,
                        value:role.id
                    };
                })
            },
            {
                message:"Manager?",
                type:"list",
                name:"manager_id",
                choices: employeeSelections
            }            
        ]).then((response)=>{             
            
            
            connection.query("INSERT INTO employee SET ?", response, (err,result)=>{
                if(err) throw err;
                console.log("Inserted as ID"+result.insertId);
            });
            viewMainQuestions()

        });
    });
});  
}

function getRoles(cb){
    connection.query("SELECT * FROM role", (err, results) =>{
            if(err) throw err;
            cb(results);
    });
}

function getEmployees(cb){
        connection.query("SELECT * FROM employee", (err, results) =>{
                if(err) throw err;
                cb(results);
        });    
}

function viewDepartment(){
    connection.query("SELECT * FROM department", (err,results) =>{
        if(err) throw err;
        console.table(results)
        viewMainQuestions()
    });
    }

function viewRole(){
    getRoles((roles)=>{
          //loop over the roles and print info from each one to the terminal 
          console.table(roles);
          viewMainQuestions();
    });
    
}

function viewEmployee(){ 
    getEmployees((employees)=>{
        console.table(employees);
        viewMainQuestions();
    });  
}


function updateEmployeeRoles(){
      
    getEmployees((employees)=>{
        employeeSelections=employees.map(employee =>{
        return{
            name:employee.first_name + ' ' +employee.last_name,
            value:employee.id
        };
        });
    });

    getRoles((roles)=>{
        inquirer.prompt([
                {
                    message:"Which employee's role do you want to update?",
                    type:"list",
                    name:"id",
                    choices: employeeSelections
                },
                {
                    message:"What is the new role of this employee?",
                    type:"list",
                    name:"role_id",
                    choices: roles.map(role =>{
                        return{
                            name:role.title ,
                            value:role.id
                        };
                    })
                },
            ]).then((response)=>{
                console.log(response)
                connection.query(`UPDATE employee SET role_id = ${response.role_id} WHERE id =  ${response.id}`, (err,result)=>{
                    if(err) throw err;
                    console.log(result.affectedRows + " employee role updated.");
                });

                viewMainQuestions()
            });
    });

}

viewMainQuestions();
