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





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.oexodue.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run(){
    try{
        //conect db
        const serviceCollection = client.db('armanKitchen').collection('services');
        // reveiw db
        const reviewCollection = client.db('armanKitchen').collection('reviews');

        // read all data
        app.get('/services',async(req, res) =>{
            const query ={}
            const cursor = serviceCollection.find(query);
            const services = await cursor.limit(3).toArray();
            
            res.send(services);
        });
        app.get('/allservices',async(req, res) =>{
            const query ={}
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        });
          //findOne
          app.get('/services/:id',async(req, res) =>{
            const id = req.params.id;
            const query ={_id: ObjectId(id)}
            const service = await serviceCollection.findOne(query);
            res.send(service);
        });

        // show review

     app.get('/reviews',async(req, res) =>{

            
            let query ={}
            if(req.query.service){
               query = {
                service: req.query.service
               }
            }
            else if(req.query.email){
                query = {
                    email: req.query.email
                   }

            }
            const cursor = reviewCollection.find(query);
            const result = await cursor.toArray();
            //sorting
            let newdata = result.sort((a,b) => b.date.localeCompare(a.date));
            res.send(newdata);

       });
    

        // post on review
        app.post('/reviews', async(req, res) =>{
            const reveiw = req.body;
            const result = await reviewCollection.insertOne(reveiw);
            res.send(result);
        });
          //delete
          app.delete('/reviews/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};

            const result = await reviewCollection.deleteOne(query);
            res.send(result);
        })

        //update
        app.get('/reviews/:id', async (req, res) =>{
            const id = req.params.id;
            const query ={ _id: ObjectId(id)};
            const service = await reviewCollection.findOne(query);
            res.send(service);
        });
        app.put("/reviews/:id", async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const user = req.body;
      
            const option = { upsert: true };
            const updateUser = {
              $set:{
                service:user.service,
                serviceName: user.serviceName,
                price: user.price,
                reviewer: user.reviewer,
                  email: user.email,
                  img: user.img,
                  rating: user.rating,
                  date: user.date,
                  message: user.message
              }
            }
            const result = await reviewCollection.updateOne(filter, updateUser, option)
      
            res.send(result);
          });
           
       

    }
    finally{
}

}
run().catch(err => console.error(err));




app.get('/', (req, res) => {
    res.send('Armans Kitchen server is running')
  })
  
  app.listen(port, () => {
    console.log(`Armans Kitchen is runing on port ${port}`)
  })