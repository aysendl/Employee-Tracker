 const connection = require("./db/connection");
 const inquirer = require("inquirer");


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
            console.log("ALERT");
    
            connection.query("INSERT INTO role SET ?", response, (err,result)=>{
                if(err) throw err;
                console.log("Inserted as ID"+result.insertId);
            });
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


}

function viewRole(){

    getRoles((roles)=>{
          //loop over the roles and print info from each one to the terminal      
    });
    
}

function viewEmployee(){ 

   
}


function updateEmployeeRoles(){
      
}

addEmployee();
