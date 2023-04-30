import express from 'express';
import { MongoClient } from 'mongodb';

const app = express();
const port = 3000;
const uri = "mongodb+srv://No3Mc:DJ2vCcF7llVDO2Ly@cluster0.cxtyi36.mongodb.net/Parking?retryWrites=true&w=majority";

async function startServer() {
  const client = await MongoClient.connect(uri, { useNewUrlParser: true });
  const markersCollection = client.db("Parking").collection("marker");
  console.log("Connected to MongoDB Atlas");

  app.get('/', async (req, res) => {
    const markers = await markersCollection.find().toArray();
    res.send(markers);
  });

  // Start server
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

startServer().catch(err => {
  console.error(err);
});

