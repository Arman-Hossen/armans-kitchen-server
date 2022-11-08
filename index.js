const express = require('express');
const cors = require('cors');

// const jwt = require('jsonwebtoken');

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;



//middleware
app.use(cors());
app.use(express.json());

//user: armanKitchenDB
//password: TzZyd2nCQkdcVtHt

app.get('/', (req, res) => {
    res.send('Armans Kitchen server is running')
  })
  
  app.listen(port, () => {
    console.log(`Armans Kitchen is runing on port ${port}`)
  })