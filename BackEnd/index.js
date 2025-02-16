const express = require('express');

const connectDB = require('./ConnectDatabase.js');

const app = express();

let database = null;
(async () => {
        try {
            database = await connectDB();
            app.listen(3000, () => {
                console.log('Server running on port 3000');
            });
        } catch (err) {
            console.error("Database connection failed:", err);
        }
})();


app.get('/todo',(req, res) => {

        if(database===null){
                return res.status(500).send('Database connection failed');
        }
        
        database.execute("select * from todo")
        .then((data)=>{
               res.status(200).send(data[0]);
        })
        .catch(err => res.status(500).send('Database query failed'));

});


app.post('/todo',express.json(),(req,res)=>{
        if(database===null){
                return res.status(500).send('Database connection failed');
        }

        const body  = req.body;

        for(let key of Object.keys(body)){
                if(key!=='task' && key!=='duration' && key!=='amount' && key!=='topic'){
                        return res.status(500).send('field not found');
                }
        }

        database.execute("insert into todo (topic,task,duration,amount) values (?,?,?,?)",
                [body.topic,body.task,body.duration,body.amount]
        )
        .then(() => res.status(201).send('Data inserted successfully'))
        .catch(err => res.status(500).send('Database query failed'));

});


app.delete('/todo/:id',(req,res)=>{

        if(database===null){
                return res.status(500).send('Database connection failed');
        }

        const id= req.params.id;

        database.execute("delete from todo where id = ?",[id])
        .then(() => res.status(200).send('Data deleted successfully'))
        .catch(err => res.status(500).send('Database query failed'));
});



app.patch('/todo/:id',express.json(),(req,res)=>{
        if(database===null){
                return res.status(500).send('Database connection failed');
        }
        
        const id = req.params.id;
        const body = req.body;

        let query = "update todo set ",val = [];

        
        for(let [key,value] of Object.entries(body)){
                if(key==='status' || key==='duration' || key==='amount' || key==='topic' || key==='task'){
                        query += `${key} = ? ,`;
                        val.push(value);
                }
                else return res.status(500).send('field not found');
        }

        query = query.slice(0,-1) + "where id = ?";
        val.push(id);

        
        database.execute(query,val)
        .then(() => res.status(200).send('Data updated successfully'))
        .catch(err => res.status(500).send('Database query failed'));

});




/**
 * get /todo done
 * post /todo done
 * put /todo/id
 * patch /todo/id
 * delete /todo/id
 */