const express = require('express');

const connectDB = require('./ConnectDatabase.js');

const app = express();

let database = null;
(async ()=>{database = await connectDB()})();

app.get('/', async (req, res) => {
        try {
                if(database===null) throw new Error('Database connection failed');
                const data = await database.execute("select * from todo");
                res.status(200).send(data[0]);
        } catch (err) {
                res.status(500).send('Database connection failed');
        }
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
