const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ooo4k.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
  try {
     await client.connect();
     const database = client.db("volunteernetwork");
    const usersCollection = database.collection("vservices");

    //get all packages api
     app.get("/allpackages", async (req, res) => {
      const cursor = usersCollection.find({});
      const users = await cursor.toArray();
      res.send(users);
    });

    //get Detailed item
    app.get('/DetailedService/:packageId', async(req,res) => {
      const packageId = req.params.packageId;
      const query = { _id: ObjectId(packageId) };
      const package = await usersCollection.findOne(query);
      console.log("load user with id", packageId);
      res.send(package);
    })

    //post api
    app.post("/allpackages", async (req, res) => {
      const newPack = req.body;
      const result = await usersCollection.insertOne(newPack);
      console.log("got new pack", req.body);
      console.log("successfully added pack", result);
      res.json(result);
    });

    //delete API
    app.delete('/DetailedService/:packageId', async(req,res) => {
      const packageId = req.params.packageId;
      const query = { _id: ObjectId(packageId) };
      const package = await usersCollection.deleteOne(query);
      console.log("load user with id", packageId);
      res.send(package);
    })

    //update api
    app.put("/DetailedService/updatepack/:packageId", async (req, res) => {
      const newPack = req.params.packageId;
      const updatedPack = req.body;
      const filter = { _id: ObjectId(newPack) };
      const options = {upsert: true}

      const updateDoc = {
        $set: {
          title: updatedPack.title,
          img: updatedPack.img,
        },
      };
      const result = await usersCollection.updateOne(
        filter,
        updateDoc,
        options
      );

      console.log("updating user", req);
      res.send(result);
    });






     console.log('connected to Volunteer database');
  }
  finally{
    //   await client.close()
  }
}
run().catch(console.dir)

app.get('/', (req,res) => {
    res.send('Running Volunteer Server')
})

app.listen(port, () => {
    console.log('Listening to Volunteer server on', port);
})