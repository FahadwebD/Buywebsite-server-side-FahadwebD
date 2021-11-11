const express = require('express')
const app = express()
const cors = require('cors');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ffrgt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run (){

    try{
        await client.connect();
        const database = client.db('buy_watch');
        const productCollection = database.collection('products');
        const ordersCollection = database.collection('orders');

        app.get('/products' , async(req , res)=>{
            const cursor = productCollection.find({});
            const products = await cursor.toArray();
            res.send(products)
        })
         

        app.post('/orders' , async(req ,res)=>{
            const order = req.body;
            const result = await ordersCollection.insertOne(order)
            console.log(order);
            res.json(result)
        })
    }
    finally{
        // await client.close();
    }


}

run().catch(console.dir);



app.get('/', ( req , res)=>{
    res.send('assignment 12')
})

app.listen(port , ()=>{
    console.log(`listening at ${port}`)
})