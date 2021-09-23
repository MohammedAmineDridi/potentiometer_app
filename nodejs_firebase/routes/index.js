var express = require('express');
var router = express.Router();


// init firebase admin 
var admin = require("firebase-admin");
const ServiceAccount = require('../project1-nodejs-firebase-adminsdk-nx7fa-05aaa5a8a2.json');

admin.initializeApp({
  credential: admin.credential.cert(ServiceAccount)
});  


function insert_data_to_firestore(nom_collection,nom_document,value){

// instance db firestore 
  const db = admin.firestore();
  // write and read data to firestore in firebase .
  // rq : firestore est un service de bdd temps réel dans la platform firebase .

    const valueData = {
      analog_value : value.toString()
      
    };

    
    return db.collection(nom_collection.toString() ).doc(nom_document.toString() ).set(valueData).then(()=>{
      console.log( "value = " + valueData.analog_value + " is added to tableau =  " + nom_collection.toString() );
    });
}


router.get('/', function(req, res, next) {

  var user1 = {
    nom : "amine",
    prenom : "dridi"
  };

  var user2 = {
    nom : "yessine",
    prenom : "khanfir"
  };

  var user3 = {
    nom : "wajih",
    prenom : "jendoubi"
  };
 
  insert_data_to_firestore("users","user1",user1.nom,user1.prenom); // inserer user1

  insert_data_to_firestore("users","user2",user2.nom,user2.prenom); // inserer user2

  insert_data_to_firestore("users","user3",user3.nom,user3.prenom); // inserer user3

  res.end();

});





// ajouter un ligne avec url params .


router.get('/add_value_firebase/:value', function(req, res, next) {

  // nom collection = analog_values
  // document = value_1234..
  // value =

  var analog_value =req.params.value ;

  var random_int = Math.floor(Math.random() * 100);  
 
  insert_data_to_firestore("analog_values","value_"+random_int.toString() ,analog_value.toString() ); // inserer user1

  res.end();

});




// get data from firebase by nom


async function getData_firebase_nom(nom_user){

  const db = admin.firestore();

  const user1 = db.collection('users').doc(nom_user.toString());
  const doc = await user1.get();

  if (!doc.exists) {
    console.log('No such document = no ligne !');
  } else {
    console.log('Document data - ligne =', doc.data() );
  }

}




// par ex : get data=ligne par nom 


router.get('/getData/:nom_user', function(req, res, next) {
 
  var user_name = req.params.nom_user ;

  getData_firebase_nom( user_name.toString() ) ;

  res.end();

});



// get all data in firebase 

async function getAllData(){
  // instance db firestore 
  const db = admin.firestore();
const users = db.collection('users');
const snapshot = await users.get();
snapshot.forEach(doc => {
  console.log( doc.id, '=>', doc.data() );

});

}


// get all data

router.get('/getAllData', function(req, res, next) {
 
  getAllData();

  res.end();

});



// for example : 

// function =  get user where prenom = .....



async function getData_firebase_prenom(prenom_user){

  const db = admin.firestore();
  const users = db.collection('users');
const snapshot = await users.where('prenom', '==',prenom_user.toString()).get();
if (snapshot.empty) {
  console.log('No matching documents.');
  return;
}  

snapshot.forEach(doc => {
  console.log(doc.id, '=>', doc.data());
});
}



router.get('/getDataPrenom/:prenom_user', function(req, res, next) {
 
   var user_prenom = req.params.prenom_user ;

  getData_firebase_prenom(user_prenom.toString()) ;

  res.end();

});


// for more info about firestore = 'https://firebase.google.com/docs/firestore/query-data/get-data#node.js_1'

module.exports = router;
