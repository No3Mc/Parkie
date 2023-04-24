const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// MongoDB connection
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://No3Mc:DJ2vCcF7llVDO2Ly@cluster0.cxtyi36.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri, { useNewUrlParser: true });
let usersCollection;
let connected = false;

client.connect(err => {
  if (err) throw err;
  usersCollection = client.db("USER_DB").collection("users");
  console.log("Connected to MongoDB Atlas");
  connected = true;
});

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Routes
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/login.html');
});

app.post('/login', (req, res) => {
  if (!connected) {
    res.status(500).send('Error: Database connection not established');
    return;
  }

  const email = req.body.email;
  const password = req.body.password;

  usersCollection.findOne({ email: email }, (err, user) => {
    if (err) throw err;

    if (user && user.password === password) {
      console.log(`Login successful for user: ${email}`);
      res.send('Login successful!');
    } else {
      console.log(`Login failed for user: ${email}`);
      res.status(401).send('Invalid email or password');
    }
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
