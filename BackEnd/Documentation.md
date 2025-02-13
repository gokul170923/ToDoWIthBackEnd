#  mysql 1 does not support async nature
const mysql = require('mysql2/promise');


# i will export a function like express
async function connectDB(){
        try{
                const dbConnectionObject = await mysql.createConnection(
                        {
                                host:"localhost",
                                user:"dev_user",
                                password:"dev_pass",
                                database:"test"
                        }
                );
                console.log('Connected to MySQL');
                return dbConnectionObject;
                
        }
        catch(err){
                console.error('Database connection failed:', err);
                return null;
        }
}

module.exports = connectDB;

# This will contain an array with two elements:
1️⃣ Rows → An array of the fetched records from the todo table.
2️⃣ Metadata → An array containing metadata about the query execution (column definitions, etc.).

const data = await database.execute("select * from todo");
[
  [
    {
      id: 1,
      topic: 'js',
      task: 'learn express',
      duration: '2 weeks',
      amount: '10 pages',
      status: 2
    }
  ]
  
  ,

  [
    `id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `topic` VARCHAR(200),
    `task` VARCHAR(1000),
    `duration` VARCHAR(200),
    `amount` VARCHAR(200),
    `status` INT
  ]
]


