const MongoClient = require('mongodb').MongoClient;

const uri = 'mongodb+srv://No3Mc:DJ2vCcF7llVDO2Ly@cluster0.cxtyi36.mongodb.net/test?retryWrites=true&w=majority';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect()
  .then(() => {
    console.log('Connected to MongoDB Atlas cluster!');
    const db = client.db('USER_DB');
    const usersCollection = db.collection('users');

  })
  .catch(err => {
    console.log(err);
  });
