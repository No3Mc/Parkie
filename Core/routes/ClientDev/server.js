const express = require('express');
const rateLimit = require("express-rate-limit");
const mongodb = require('mongodb');
const { MongoClient, ObjectId } = require('mongodb');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const port = 4000;

// MongoDB Atlas connection string
const connectionString = 'mongodb+srv://No3Mc:DJ2vCcF7llVDO2Ly@cluster0.cxtyi36.mongodb.net/Parking?retryWrites=true&w=majority';
const client = new MongoClient(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100 
});

// Middleware
app.use(bodyParser.json());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));



// // Define the route for /book endpoint
app.post('/book', limiter , async (req, res) => {
  try {
    // Extract the form data from the request body
    const { lat, long, ...formData } = req.body;

    // Create a new MongoClient
    const client = new mongodb.MongoClient(connectionString, { useUnifiedTopology: true });

    // Connect to the MongoDB Atlas
    await client.connect();

    // Access the parking database
    const db = client.db('Parking');

    // Insert the lat and long into the marker collection with status as "available"
    await db.collection('marker').insertOne({ lat, long, status: 'available' });

    // Insert the remaining form data into the lending collection
    await db.collection('lending').insertOne(formData);

    // Close the database connection
    client.close();

    // Send a success response
    res.status(200).json({ message: 'Booking successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred' });
  }
});

// lending histroy
app.get('/history', limiter , async (req, res) => {
  try {
    // Connect to the MongoDB Atlas
    await client.connect();

    // Access the parking database
    const db = client.db('Parking');

    // Fetch all documents from the lending collection
    const lendingHistory = await db.collection('lending').find().toArray();

    // Send the lending history as the response
    res.status(200).json(lendingHistory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred' });
  }
});

// Edit a lending entry
app.put('/lending/:id', limiter , async (req, res) => {
  try {
    const lendingId = req.params.id;
    const updatedLending = req.body;

    // Connect to the MongoDB Atlas
    await client.connect();

    // Access the parking database
    const db = client.db('Parking');

    // Update the lending entry with the specified ID
    const result = await db.collection('lending').updateOne(
      { _id: new ObjectId(lendingId) },
      { $set: updatedLending }
    );

    if (result.matchedCount === 0) {
      res.status(404).json({ message: 'Lending entry not found' });
    } else {
      res.status(200).json({ message: 'Lending entry updated' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred' });
  } finally {
    // Close the database connection
    await client.close();
  }
});

// Delete a lending entry
app.delete('/lending/:id', limiter , async (req, res) => {
  try {
    const lendingId = req.params.id;

    // Connect to the MongoDB Atlas
    await client.connect();

    // Access the parking database
    const db = client.db('Parking');

    // Delete the lending entry with the specified ID
    const result = await db.collection('lending').deleteOne({
      _id: new ObjectId(lendingId)
    });

    if (result.deletedCount === 0) {
      res.status(404).json({ message: 'Lending entry not found' });
    } else {
      res.status(200).json({ message: 'Lending entry deleted' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

