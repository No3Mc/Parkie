  require("dotenv").config()

  const express = require('express');
  const rateLimit = require("express-rate-limit");
  const { MongoClient, ObjectId } = require('mongodb');
  const { readFile } = require('fs/promises');
  const sgMail = require('@sendgrid/mail')

  const app = express();
  const port = 3000;
  const uri = "mongodb+srv://No3Mc:DJ2vCcF7llVDO2Ly@cluster0.cxtyi36.mongodb.net/Parking?retryWrites=true&w=majority";

  // middle ware
  app.use(express.static('public'));
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }));

  // stripe api key
  const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY)

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
  }

  // testing data
  const parkSlots =  new Map ([
    [1, {priceInCents: 100, name: "Parking slot"}]
  ])

  // stripe checkout
  app.post('/create-checkout-session', async (req, res) => {
    const { carno, name, email, no, markerId } = req.body;
    try{
      const client = await MongoClient.connect(uri, { useNewUrlParser: true });
      const markersCollection = client.db("Parking").collection("marker");
      const marker = await markersCollection.findOne({ _id: new ObjectId(markerId) });
            
      if (marker.status === "available") { 
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          mode: 'payment',
          line_items: req.body.items.map(item =>{
            const parkSlot = parkSlots.get(item.id)
            return{
              price_data: {
                currency: 'gbp',
                product_data: {
                  name: parkSlot.name,
                },
                unit_amount: parkSlot.priceInCents,
              },
              quantity: item.quantity,
            }
          }),     
          success_url: `${process.env.SERVER_URL}/book?carno=${carno}&name=${name}&email=${email}&no=${no}&markerId=${markerId}`,
          cancel_url: `${process.env.SERVER_URL}/cancel.html`,
          metadata: {
            paymentTimestamp: new Date().toISOString(), // Store the payment timestamp
            success_message: "Payment successful!",
          },
        });
        res.json({ url: session.url});
      } 
      else {
        // Marker is already booked, send an error message to the user
        res.status(409).json({ message: "Marker is already booked ⚠️" });
      }
    }
    catch (err) {
      console.error(err);
      res.status(500).json({ message: "We are facing unexpected error ⚠️" + err.message });
    }
  });
  
  // Endpoint to fetch payment history
  app.get('/payment/history', async (req, res) => {
    try {
      // Fetch payment history from the Stripe API
      const paymentHistory = await stripe.paymentIntents.list();
  
      // Process the payment history data as needed
      const formattedPaymentHistory = paymentHistory.data.map(payment => ({
        id: payment.id,
        customerName: payment.metadata.name,
        amount: (payment.amount / 100).toFixed(2), // Assuming payment amount is in cents
        status: payment.status
      }));
  
      // Send the formatted payment history as the response
      res.json(formattedPaymentHistory);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error fetching payment history');
    }
    });      

  // booking 
  const { encode } = require('html-entities');

  app.get('/book', async (req, res) => {
    const { carno, name, email, no, markerId } = req.query;
    
    // Validate markerId to ensure it's a valid ObjectId
    if (!ObjectId.isValid(markerId)) {
      return res.status(400).send('Invalid markerId');
    }
  
    try {
      const client = await MongoClient.connect(uri, { useNewUrlParser: true });
      const markersCollection = client.db("Parking").collection("marker");
      const bookingsCollection = client.db("Parking").collection("bookings"); // New collection
  
      const marker = await markersCollection.findOne({ _id: new ObjectId(markerId) });
  
      if (marker.status === "available") {
        const currentTime = new Date(); // Get the current time
        const updatedMarker = await markersCollection.findOneAndUpdate(
          { _id: new ObjectId(markerId) },
          { $set: { carno, name, email, no, status: 'booked', time: currentTime } },
          { returnOriginal: false }
        );
  
        // Insert booking data into the "bookings" collection
        const bookingData = {
          carno,
          name,
          email,
          no,
          markerId,
          status: 'booked',
          time: currentTime
        };
        await bookingsCollection.insertOne(bookingData);
  
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
  
        sgMail.setApiKey(process.env.SG_PRIVATE_KEY);
        await sgMail.send(msg);
  
        res.send(`
          <script>
            window.alert("Payment and Booking Successful!!");
            window.parent.postMessage({ action: 'stripeSuccess' }, '*');
            window.location.href = 'http://localhost:5000/main'; // Redirects to localhost:5000
          </script>
        `);
      } else {
        // Marker is already booked, send an error message to the user
        const errorMessage = encode(`Marker ${markerId} is already booked ⚠️`);
        res.status(409).send(errorMessage);
      }
    } catch (err) {
      console.error(err);
      res.status(500).send(`We are facing an unexpected error ⚠️ ${err.message}`);
    }
  });  
  
  
  
  // getting the parking data
  app.get('/history', (req, res) => {
    res.sendFile(__dirname + '/history.html');
  });
  
  app.get('/history/data', async (req, res) => {
    try {
      const client = await MongoClient.connect(uri, { useNewUrlParser: true });
      const markersCollection = client.db("Parking").collection("marker");
      const history = await markersCollection.find({ status: 'booked' }).toArray();
      res.json(history);
    } catch (err) {
      console.error(err);
      res.status(500).send(`We are facing unexpected error ⚠️ ${err.message}`);
    }
  });
  
  // Serve the bookHistory.html page
  app.get('/bookHistory', (req, res) => {
    res.sendFile(__dirname + '/bookHistory.html');
  });

  // Retrieve booking history data
  app.get('/bookingData', async (req, res) => {
    try {
      const client = await MongoClient.connect(uri, { useNewUrlParser: true });
      const bookingsCollection = client.db("Parking").collection("bookings");

      const bookings = await bookingsCollection.find().toArray();

      res.json(bookings);
    } catch (err) {
      console.error(err);
      res.status(500).send('An error occurred while retrieving booking history.');
    }
  });

  // cancelling the booking
  app.delete('/history/data/:id', async (req, res) => {
    try {
      const client = await MongoClient.connect(uri, { useNewUrlParser: true });
      const markersCollection = client.db("Parking").collection("marker");
      const markerId = req.params.id;
  
      const marker = await markersCollection.findOne({ _id: new ObjectId(markerId) });
  
      if (!marker) {
        res.status(404).json({ message: "Marker not found ⚠️" });
        return;
      }
  
      if (marker.status !== 'booked') {
        res.status(409).json({ message: "Cannot delete. Marker is not booked ⚠️" });
        return;
      }
  
      const { name, email } = marker;
  
      await markersCollection.updateOne(
        { _id: new ObjectId(markerId) },
        {
          $set: {
            status: 'available',
            carno: '',
            name: '',
            email: '',
            no: '',
            time: null
          }
        }
      );
  
      // Send cancellation email using SendGrid
      const sgMail = require('@sendgrid/mail');
      sgMail.setApiKey(process.env.SG_PRIVATE_KEY);
  
      const msg = {
        to: email,
        from: { name: 'Parkie', email: 'parkie.parking@gmail.com' },
        templateId: 'd-cc5e9e9251c54a2ab54f8451eb0beb5c',
        dynamicTemplateData: {
          name: name,
          markerId: markerId,
          email: email,
          time: null
        }
      };
  
      await sgMail.send(msg);
  
      res.sendStatus(204);
    } catch (err) {
      console.error(err);
      res.status(500).send(`We are facing unexpected error ⚠️ ${err.message}`);
    }
  });
  
  // update the booking from booking page popup
  app.put('/history/data/:id', async (req, res) => {
    try {
      const client = await MongoClient.connect(uri, { useNewUrlParser: true });
      const markersCollection = client.db("Parking").collection("marker");
      const markerId = req.params.id;
      const { name, email, carno, no } = req.body;
  
      const marker = await markersCollection.findOne({ _id: new ObjectId(markerId) });
  
      if (!marker) {
        res.status(404).json({ message: "Marker not found ⚠️" });
        return;
      }
  
      if (marker.status !== 'booked') {
        res.status(409).json({ message: "Cannot update. Marker is not booked ⚠️" });
        return;
      }
  
      const filter = { _id: new ObjectId(markerId) };
      const update = {
        $set: {
          name: name,
          email: email,
          carno: carno,
          no: no
        }
      };
  
      await markersCollection.updateOne(filter, update);
  
      // Send update email using SendGrid
      const sgMail = require('@sendgrid/mail');
      sgMail.setApiKey(process.env.SG_PRIVATE_KEY);
  
      const msg = {
        to: email,
        from: { name: 'Parkie', email: 'parkie.parking@gmail.com' },
        templateId: 'd-a7422da93f0641329b8fe9b353ef4337',
        dynamicTemplateData: {
          name: name,
          markerId: markerId,
          email: email
        }
      };
  
      await sgMail.send(msg);
  
      res.sendStatus(204);
    } catch (err) {
      console.error(err);
      res.status(500).send(`We are facing an unexpected error ⚠️ ${err.message}`);
    }
  });
  
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100 
  });
  
  app.use('/updateMarkerStatus', limiter);
   // updating the marker status automatically after time
  app.post('/updateMarkerStatus', async (req, res) => {
    try {
      // Connect to the MongoDB Atlas cluster
      const client = await MongoClient.connect(uri, { useNewUrlParser: true });
      const markersCollection = client.db("Parking").collection("marker");
  
      // Retrieve the booked markers
      const bookedMarkers = await markersCollection.find({ status: 'booked' }).toArray();
  
      // Update the marker status in the database
      await markersCollection.updateMany({ status: 'booked' }, {
        $set: {
          status: 'available',
          carno: '',
          name: '',
          email: '',
          no: '',
          time: null
        }
      });
  
      console.log('Marker status updated in the database');
  
      // Send update email using SendGrid
      const sgMail = require('@sendgrid/mail');
      sgMail.setApiKey(process.env.SG_PRIVATE_KEY);
  
      // Send an email to each user with a booked marker
      const emailPromises = bookedMarkers.map(async (marker) => {
        const { name, email } = marker;
        const msg = {
          to: email,
          from: { name: 'Parkie', email: 'parkie.parking@gmail.com' },
          templateId: 'd-30d14c1de7f74f84b21d55d1393ce190',
          dynamicTemplateData: {
            name: name,
            email: email
          }
        };
        await sgMail.send(msg);
        console.log(`Email sent successfully to ${email}`);
      });
  
      await Promise.all(emailPromises);
  
      console.log('All emails sent successfully');
      res.status(200).send('Marker status updated and emails sent');
    } catch (err) {
      console.error(err);
      res.status(500).send('Failed to update marker status and send emails');
    }
  });
  
  
  
  
  app.listen(port, () => {
      console.log(`App listening at http://localhost:${port}`);
  });


start();






      




