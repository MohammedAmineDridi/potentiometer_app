var express = require('express');
var router = express.Router();

// node mailer include
var nodemailer = require('nodemailer');





function send_mail(from,Subject,destinataire,text_mail){

  var nodemailer = require('nodemailer');

  var transporter = nodemailer.createTransport({

    service:'gmail',
    auth:{
      user:'amindridi447@gmail.com',
      pass:'Kaki1112'
    }

  });

  var mailoptions = {
    from:from,
    to:destinataire,
    subject:Subject,
    text:text_mail,
    
    
  };

  transporter.sendMail(mailoptions,function(error,info){

    if(error){
      console.log(error);
      var err = "verifier votre connexion";
      console.log(err);
    }
    else{
      var yes = "email sent to "+destinataire.toString();

      console.log("----> email sent to " + destinataire ) ;

      console.log(yes);
    }

  });


}



function getCurrentDate_Time(){

  let date_ob = new Date();

// current date
// adjust 0 before single digit date
let date = ("0" + date_ob.getDate()).slice(-2);

// current month
let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

// current year
let year = date_ob.getFullYear();

// current hours
let hours = date_ob.getHours();

// current minutes
let minutes = date_ob.getMinutes();

// current seconds
let seconds = date_ob.getSeconds();

// prints date in YYYY-MM-DD format
console.log(year + "-" + month + "-" + date);

// prints date & time in YYYY-MM-DD HH:MM:SS format
console.log(year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds);

// prints time in HH:MM format
console.log(hours + ":" + minutes);

var full_date = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds ;

return full_date ;
}


router.get('/', function(req, res, next) {
  
  res.json("hello");
});




router.get('/send_mail/:from/:to/:sub/:msg', function(req, res, next) { 

  var from = req.params.from ;
  var subject = req.params.sub ;
  var destinataire = req.params.to ;
  var msg = req.params.msg ;
  send_mail(from,subject,destinataire,msg+" ==> date&time = "+getCurrentDate_Time() );
  res.send('mail sended successfuly :) ') ;
});

// insert analog value in mysql database .

var mysql = require('mysql');


var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Aminedridi11",
  database: "analog"
});


router.get('/insert_analog_value/:value', function(req, res, next) {
  
  var analog_value = req.params.value ;

  var post_value_request = "INSERT INTO analog_values (value,date_time) VALUES ('"+analog_value+"', '"+getCurrentDate_Time()+"')";

  console.log(post_value_request);
  
  con.query(post_value_request, function (err, result, fields) {

    if(err){
      console.log(err);
    }
    else{
      console.log(" value added successfly ") ;
    }


  });
  res.json("value sended ");
});




// get all values of analog sensor .



/* GET home page. */
router.get('/get_analog_values', function(req, res, next) {
  // la liste des produits 
 
  // var list_values ;

  let list_values = "SELECT * FROM analog_values";

  console.log(list_values);
  
  con.query(list_values, function (err, result, fields) {
    if (err) {
      //console.log(err);
      console.log("error");
    }

    else{

      if(result==""){
        //alert("email or password incorrect !")
        console.log("no values !");
      }
      else{
        console.log(result);
    console.log("values exist ");

       
    console.log("-------------- list --------------------");
    console.log("longeur de list = " + result.length);
    console.log("-----------------------------------");

    // set this result in global var 

    var i ;
    for( i=0;i<result.length;i++){
      console.log("-------------- var global --------------------");
    console.log("nom = " + result[i]['nom'] );
    console.log("-----------------------------------");
    }

    res.render('index.twig',{analogValues:result});
       
      }
    }
  });
});




// part 3 : export database data to pdf .

// function export pdf .

function export_pdf(){


  // step 1 :get all data from database .

  let list_values = "SELECT * FROM analog_values";

  console.log(list_values);
  
  con.query(list_values, function (err, result, fields) {
    if (err) {
      //console.log(err);
      console.log("error");
    }

    else{

      if(result==""){
        //alert("email or password incorrect !")
        console.log("no values !");
      }
      else{
        console.log(result);
    console.log("values exist ");

       /*
    console.log("-------------- list --------------------");
    console.log("longeur de list = " + result.length);
    console.log("-----------------------------------");
*/
    // set this result in global var 



    // part 2 : create pdf  .

    var i ;

    
  const PDFDocument = require('pdfkit');
  const fs = require('fs');

  let pdfDoc = new PDFDocument;
  pdfDoc.pipe(fs.createWriteStream('analog_values_report.pdf'));

        // title of pdf  . 

        pdfDoc
    .fillColor('green')
    .fontSize(30)
    .text( "          Aanalog Values Report " );  // (x = 50 ,y = 50 ) .
  

    pdfDoc
    .fillColor('green')
    .fontSize(30)
    .text( "                  " );  // (x = 50 ,y = 50 ) .
  
    pdfDoc
    .fillColor('green')
    .fontSize(30)
    .text( "                  " );  // (x = 50 ,y = 50 ) .
  

    for( i=0;i<result.length;i++){
      var x , y = 0 ;
      console.log("-------------- var global --------------------");
    console.log("value = " + result[i]['value'] );
    console.log("date & time = " + result[i]['date_time'] );

    if( result[i]['value'] > 900 ){

      pdfDoc
    .fillColor('red')
    .fontSize(20)
    .text("Value = " + result[i]['value'].toString() + " / Date = " + result[i]['date_time'].toString() );  // (x = 50 ,y = 50 ) .
  
    pdfDoc
    .fillColor('green')
    .fontSize(30)
    .text( "                  " );  // (x = 50 ,y = 50 ) .
  

    }
    else{

      pdfDoc
    .fillColor('black')
    .fontSize(20)
    .text("Value = " + result[i]['value'].toString() + " / Date = " + result[i]['date_time'].toString() );  // (x = 50 ,y = 50 ) .
  
    pdfDoc
    .fillColor('green')
    .fontSize(30)
    .text( "                  " );  // (x = 50 ,y = 50 ) .
  

    }

    }

    
  pdfDoc.end();
   
      } 
    }
  });


}

router.get('/export_pdf', function(req, res, next) {

    // call function export pdf .

    export_pdf() ;

    res.redirect("/get_analog_values");
});

 module.exports = router;


