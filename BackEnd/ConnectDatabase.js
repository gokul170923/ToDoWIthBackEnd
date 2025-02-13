const mysql = require('mysql2/promise');

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
