const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

// connect to the MongoDB database
mongoose.connect('mongodb://localhost:27017/mydb', { useNewUrlParser: true, useUnifiedTopology: true });

// create a schema for the customer data
const customerSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  phone: { type: String, required: true }
});

// create a model for the customer data
const Customer = mongoose.model('Customer', customerSchema);

app.use(bodyParser.urlencoded({ extended: true }));

// set up the route to handle the form submission
app.post('/register', (req, res) => {
  const { email, password, phone } = req.body;

  // validate the form data
  if (!email || !password || !phone) {
    return res.status(400).json({ error: 'Please fill in all required fields' });
  }

  // create a new customer document
  const customer = new Customer({ email, password, phone });

  // save the customer to the database
  customer.save((err, customer) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.status(200).json({ message: 'Registration successful' });
  });
});

// start the server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});
