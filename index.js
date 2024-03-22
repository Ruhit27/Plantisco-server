const express = require('express');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const port = 3000;

app.use(cors());
app.use(express.json())


const uri = "mongodb+srv://john:123@todays-date.r1b2kle.mongodb.net/?retryWrites=true&w=majority&appName=todays-date";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const productsCollection = client.db('Plants').collection('products')
    const purchaseCollection = client.db('Plants').collection('purchase')

    app.post('/products',async(req,res)=>{
        const cursor = req.body;
        const result = await productsCollection.insertOne(cursor)
        res.send(result)
    })

    app.get('/products',async(req,res)=>{
        const result = await productsCollection.find().toArray();
        res.send(result)
    })

    app.post('/purchase',async(req,res)=>{
      const cursor = req.body;
      const result = await purchaseCollection.insertOne(cursor)
      res.send(result)
      
    })

    app.get('/purchase',async(req,res)=>{
      const result = await purchaseCollection.find().toArray();
      res.send(result)
    })

    app.delete('/purchase/:id',async(req,res)=>{
      const id = req.params.id
      const cursor = {_id : new ObjectId(id)}
      const result = await purchaseCollection.deleteOne(cursor);
    res.send(result)
    })

    app.get('/purchase/:email',async(req,res)=>{
      const email = req.params.email;
      const cursor = {Email : email};
      const result = await purchaseCollection.findOne(cursor);
      res.send(result)
    })

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send('Plant server running ooooooooooo')
})
app.get('/test',(req,res)=>{
    res.send('test api calling')
})

app.listen(port,()=>{
    console.log(`server is running on port ${port}`)
})