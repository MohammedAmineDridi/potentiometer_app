/*Arduino  code for ESP8266 AJAX Webserver

www.circuitdigest.com 

*/

char webpage[]  = " <!DOCTYPE html> <html> <body style='background-color: #f9e79f '> <center> <div><h2> Analog Value : <span id='adc_val'>0</span><br><br></h2></div><script> function send(led_sts){ var xhttp = new XMLHttpRequest(); xhttp.onreadystatechange = function() { if (this.readyState == 4 && this.status == 200) { document.getElementById('state').innerHTML = this.responseText;}}; xhttp.open('GET', 'led_set?state='+led_sts, true); xhttp.send(); } setInterval(function() { getData(); }, 500); function getData() { var xhttp = new XMLHttpRequest(); xhttp.onreadystatechange = function() { if (this.readyState == 4 && this.status == 200) { document.getElementById('adc_val').innerHTML = this.responseText; }}; xhttp.open('GET', 'adcread', true);  xhttp.send(); } </script> </center> </body> </html>" ;  

#define LED D1  // Led in NodeMCU at pin GPIO16 (D0).

#include <ESP8266WiFi.h>
#include <WiFiClient.h>
#include <ESP8266WebServer.h>
#include <ESP8266HTTPClient.h>
const char* ssid = "ya ga7af";
const char* password = "ga7af2019";
ESP8266WebServer server(80);

// add analog value to firesbase cloud platform .

void add_to_firestore_database(int value){

  HTTPClient http;
  WiFiClient c ;
  String URL = "http://192.168.137.1:4444/add_value_firebase/"+String(value); // Works with HTTP
  Serial.println(URL);
  http.begin(c,URL); // Works with HTTP
  int httpCode = http.GET();
  /*
  if (httpCode > 0) {
    String payload = http.getString();
    Serial.println(payload); // Print response
  }
  */
  
  http.end();
  // delay(3000);
  

}

// send mail function .

void send_mail(String from , String to ,String subject , String msg){

  HTTPClient http;
  WiFiClient c ;
  String URL = "http://192.168.137.1:3000/send_mail/"+from+"/"+to+"/"+subject+"/"+msg; // Works with HTTP
  Serial.println(URL);
  http.begin(c,URL); // Works with HTTP
  int httpCode = http.GET();
  if (httpCode > 0) {
    String payload = http.getString();
    Serial.println(payload); // Print response
  }
  http.end();
  // delay(3000);
  }


// function to : add analog value to database in case of the alert 

void add_analog_value_to_database(int value){

  HTTPClient http;
  WiFiClient c ;
  String URL = "http://192.168.137.1:3000/insert_analog_value/"+String(value) ; // Works with HTTP
  Serial.println(URL);
  http.begin(c,URL); // Works with HTTP
  int httpCode = http.GET();
  if (httpCode > 0) {
    String payload = http.getString();
    Serial.println(payload); // Print response
  }
  http.end();
  // delay(3000);
  }

void handleRoot() 
{
 String s = webpage;
 server.send(200, "text/html", s);
}

void sensor_data() 
{
 int a = analogRead(A0);
 int analog_value= 1024-a ;
 String sensor_value = String(analog_value);

  // value related to arduino iot cloud .

 // pot = analog_value ;

// seuil = 600 

if ( analog_value > 600 ){
  
   // Serial.println(" ==> detect analog value > 600 ") ;

// add value to local database 
  add_analog_value_to_database( analog_value ) ;



  

   if ( analog_value > 900  ){
    // send mail
     digitalWrite(LED, HIGH);

    add_analog_value_to_database( analog_value ) ; // add value to local database .
    delay(200);

     
    send_mail("amindridi447@gmail.com","amindridi447@gmail.com","analog_value>900","analog%20value%20=%20"+String(analog_value) );
    delay(200);
   
    add_to_firestore_database( analog_value ) ; // add to firestore : firebase database hosted in cloud the critical values .
   delay(200);
   
    }
  
 }
 else{
  digitalWrite(LED, LOW);
  // Serial.println(" analog value < 600 ") ;
  }
 
 server.send(200, "text/plane", sensor_value);
}

void setup()
{
  pinMode(LED, OUTPUT);    // LED pin as output.
  
  Serial.begin(115200);
  WiFi.begin(ssid, password);
  Serial.println("");

  
  while (WiFi.status() != WL_CONNECTED)
  {
    Serial.print("Connecting...");
  }
  Serial.println("");
  Serial.print("Connected to ");
  Serial.println(ssid);
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
 
  server.on("/", handleRoot);
  // server.on("/led_set", led_control);
  server.on("/adcread", sensor_data);
  server.begin();
}

void loop()
{
  server.handleClient();
}
