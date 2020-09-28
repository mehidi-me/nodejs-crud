const express = require('express')

const bodyParser = require('body-parser')

const cors = require('cors')

const ObjectID = require('mongodb').ObjectId;

const MongoClient = require('mongodb').MongoClient;

const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.json({limit:'1mb'}))

const uri = "mongodb+srv://mehidi:mehidi12345@cluster0.uiqpc.mongodb.net/testcrud?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useUnifiedTopology: true,useNewUrlParser: true });

 client.connect(() => {

  const collection = client.db("testcrud").collection("alluser");

  // data add route
  app.post('/adduser',(req, res) => {

    collection.insertOne(req.body)
    .then(() => res.send({msg:'Users have been added successfully'}))
    .catch(err => res.send({error:err}))
    
  })

  // All data get route
  app.get('/getuser',(req, res) =>{
    collection.find({}).toArray()
    .then(result => res.send(result))
  })

  // update data show route
  app.get('/updatedataget/:id',(req,res) => {
    let id = new ObjectID(req.params.id)
      collection.find({_id:id}).toArray()
      .then(result => res.send(result[0]))
      .catch(err => res.send({error:err}))
  }) 

  // data update route
  app.put('/updatedata',(req, res) => {
    let id = new ObjectID(req.body.dataid)
    const {fname,lname,email,password,number} = req.body
    collection.updateOne(
      {_id:id},
      {$set:{fname,lname,email,password,number}},(result)=>{
        res.send({msg:'Users have been update successfully'})
      }
    )
  })


  // data delete route
  app.delete('/datadelete',(req, res) => {
    let id = new ObjectID(req.body.id)
    collection.deleteOne({
      _id:id
    })
    .then(() => res.send({msg:"successfully deleted"}))
    .catch(err => res.send({error:err}))
  })

});


// site home page route
app.get('/',(req, res) => {
    res.sendFile(__dirname+'/index.html')
})

let PORT = process.env.PORT || 3000
app.listen(PORT)