var express = require('express');
var router = express.Router();
const {client, dbName} = require('../mongoDB/conexionMongo');

/* GET home page. */
router.get('/', function(req, res, next) {
  main()
  .then(datos=>{
    console.log(datos);
    datos.forEach((e)=>{
      console.log(e);
    })
    res.render('index', { data: datos[0] });
  })
  .catch(console.error)
  .finally(() => client.close());


  
});


async function main() {
  // Use connect method to connect to the server
  await client.connect();
  console.log('Connected successfully to server');
  const db = client.db(dbName);
  const collection = db.collection('Grades');

  // the following code examples can be pasted here...
  let datos = collection.aggregate([
    {
      '$match': {
        'student_id': 10
      }
    }, {
      '$project': {
        'student_id': 1, 
        'prom': 1, 
        'data': {
          'prom': '$prom', 
          'class_id': '$class_id'
        }
      }
    }, {
      '$group': {
        '_id': '$student_id', 
        'datos': {
          '$avg': '$prom'
        }, 
        'prom': {
          '$addToSet': '$data'
        }
      }
    }
  ]).toArray()


  return datos;
}

module.exports = router;
