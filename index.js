const express = require('express')
const app = express()
const cors = require('cors');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const ObjectId = require("mongodb").ObjectId;
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
        const usersCollection = database.collection('users');
        const reviewsCollection = database.collection('reviews');

        app.get('/products' , async(req , res)=>{
            const cursor = productCollection.find({});
            const products = await cursor.toArray();
            res.send(products)
        })
        app.post('/products/add' , async(req , res)=>{
            const product = req.body;
          const result = await productCollection.insertOne(product);
           res.json(result);
           
        })
         
        app.get('/orders' , async(req ,res)=>{
            const cursor = ordersCollection.find({});
            const orders = await cursor.toArray();
            res.json(orders)

        })

        app.put('/orders/:id' , async(req,res)=>{

            const id = req.params.id
            const updatedStatus = req.body;
            const filter ={_id: ObjectId(id)};
            const options ={upsert:true};
            const updateDoc ={
                $set: {
                    report:updatedStatus.report
                },
            };
            const result = await ordersCollection.updateOne(filter,updateDoc ,options)
            res.json(result)
        })

        app.get('/orders/:email' , async(req ,res)=>{
            const email = req.params.email;
            const query = {email: email}
            const cursor = ordersCollection.find(query);
            const orders = await cursor.toArray();
            res.json(orders)

        })

        
        
        app.post('/orders' , async(req ,res)=>{
            const order = req.body;
            const result = await ordersCollection.insertOne(order)
            
            res.json(result)
        })

        app.get('/users/:email' , async(req, res)=>{
            const email = req.params.email;
            const query = {email:email};
            const user = await usersCollection.findOne(query);
            let isAdmin = false;
            if(user?.role === 'admin'){
                isAdmin = true;
            }
            res.json({admin: isAdmin});
        })
        
        app.post('/users' , async(req,res)=>{
            const user = req.body;
            const result = await usersCollection.insertOne(user)
            console.log(result)
            res.json(result);
        })

        

        app.delete('/orders/:id' , async(req , res)=>{
        const id = req.params.id;
        
        const query = { _id: ObjectId(id) };
        const result= await ordersCollection.deleteOne(query);
        console.log('admin booked ' , result)
        res.json(result);
    })

    app.put('/users/admin', async(req,res)=>{
        
        const user =req.body;
        
        const filter = {email: user.email};
        const updateDoc = {$set:  {role:'admin'}};
        const result = await usersCollection.updateOne(filter, updateDoc );
        res.json(result)
    })

    app.post('/reviews/add' , async(req , res)=>{
        const review = req.body;
      const result = await reviewsCollection.insertOne(review);
       res.json(result);
       console.log(result)
    })

    app.get('/reviews' , async(req , res)=>{
        const cursor = reviewsCollection.find({});
            const reviews = await cursor.toArray();
            res.json(reviews)
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