const express = require('express');
const { MongoClient } = require('mongodb');

const url = 'mongodb://mongo:27017';

const app = express();

(async () => {
  const client = await MongoClient.connect(url);
  const db = client.db('test');

  app.use(async (req, res) => {
    const collection = db.collection('Requests');

    await collection.insertOne({
      containerId: process.env.containerId,
      ip: req.connection.remoteAddress,
      date: new Date().toLocaleString(),
    });

    const requests = await collection.find({},{projection:{ _id: 0 }}).sort({date: -1}).toArray();

    res.send(requests.map(JSON.stringify).join('<br>'));
  });

  const PORT = 3000;
  const HOST = '0.0.0.0';

  app.listen(PORT,HOST);
  console.log(`running on http://${HOST}:${PORT}`);
})();


