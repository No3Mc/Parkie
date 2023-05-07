const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const { readFile } = require('fs/promises');
const sgMail = require('@sendgrid/mail')

const app = express();
const port = 3000;
const uri = "mongodb+srv://No3Mc:DJ2vCcF7llVDO2Ly@cluster0.cxtyi36.mongodb.net/Parking?retryWrites=true&w=majority";

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

async function connectToDatabase(uri) {
  const client = await MongoClient.connect(uri, { useNewUrlParser: true });
  const markersCollection = client.db("Parking").collection("marker");
  console.log("Connected to MongoDB Atlas");

  return markersCollection.find().toArray();
}

async function start() {
  const markersWithStatus = await connectToDatabase(uri);

  app.get('/markers', (req, res) => {
    res.json(markersWithStatus);
  });

  app.post('/book', async (req, res) => {
    const { name, email, markerId } = req.body;
  
    try {
      const client = await MongoClient.connect(uri, { useNewUrlParser: true });
      const markersCollection = client.db("Parking").collection("marker");
  
      const marker = await markersCollection.findOne({ _id: new ObjectId(markerId) });
  
      if (marker.status === "available") {
        const updatedMarker = await markersCollection.findOneAndUpdate(
          { _id: new ObjectId(markerId) },
          { $set: { name, email, status: 'booked' } },
          { returnOriginal: false }
        );
  
      console.log(`Marker ${markerId} has been booked by ${name} (${email})`);

      const msg = {
        to: email,
        from: { name: 'Parkie', email: 'parkie.parking@gmail.com' },
        templateId: 'd-ec1c780d10334a3386396ea75f9fc332',
        dynamicTemplateData: {
          name: name,
          markerId: markerId,
          email: email
        }
      };

      sgMail.setApiKey('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');
      await sgMail.send(msg);

      res.json({ message: '🎉 Booking successful!' });       
      } else {
        // Marker is already booked, send an error message to the user
        res.status(409).json({ message: "Marker is already booked ⚠️" });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "We are facing unexpected error ⚠️" + err.message });
    }
  });
  
  app.listen(port, () => {
      console.log(`App listening at http://localhost:${port}`);
  });
} 

start();






      




