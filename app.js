var express = require('express');
var app = express();
var uc;
var forgot_username;
var path = require('path');
var mongo=require('mongodb');
var mongoClient=mongo.MongoClient;
var url="mongodb://aparna:aparna@ds049858.mlab.com:49858/blog";
mongoClient.connect(url,function(err,db){
 uc=db.collection('data');		
});  
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.post('/login', function ( req, res) {	
   	var username = req.param('user');
   	var name=req.param('name');
  	var pwd = req.param('pass');
 	uc.find({username: username}).toArray(function(err, docs) {
	if(docs.length==0&&username!=null&&pwd!=null){
		uc.insert({username: username, password:pwd}, function(err, result) {
		res.sendFile(__dirname + '/home.html');
		});
  	} 
	else if(docs.length!=0){
  		res.sendFile(__dirname+'/signup.html');
       	
      }
  	 });
 	var newpass=req.param('new_pass');
 	var cnfpass=req.param('pass_confirm');
 	if(newpass==cnfpass){
 	uc.update({username:forgot_username},
		{$set:{password:newpass}},{multi:true});
  	res.sendFile(__dirname+'/login.html');
 	}
  else{
  	res.sendFile(__dirname+'/reset.html');
  }	
	      
  
}); 
app.post('/home', function ( req, res) {
	 var username = req.param('login_user');
	 var pwd = req.param('login_password'); 
 uc.find({username: username,password:pwd}).toArray(function(err, docs) {
	    if(docs.length!=0&&username!=null&&pwd!=null){
	      	 
	  	 	res.sendFile(__dirname + '/home.html');
	  	 
	  	}
	  	 	else{
	  		res.sendFile(__dirname+'/login.html');
	      	console.log("Please check Username or Password");
	      	 	
	      }
	  	 });	
	      
});
app.post('/reset', function ( req, res) {
	forgot_username=req.param('user_forgot');
	uc.find({username: forgot_username}).toArray(function(err, docs) {
		if(docs.length!=0&&forgot_username!=null){
	  	 	res.sendFile(__dirname + '/reset.html'); 	 
	  	}
	  	 	else{
	  		res.sendFile(__dirname+'/forgot.html');
	      	console.log("Username not correct");
	      	 	
	      }
	  	 });	
	}); 
app.use(express.static(path.join(__dirname, '/public')));  

app.use(express.static('public'));

app.get('/', function (req, res) {
   res.sendFile(__dirname+'/home.html'); 
});
app.get('/login', function (req, res) {
   res.sendFile(__dirname+'/login.html'); 
});
app.get('/signup', function (req, res) {
   res.sendFile(__dirname+'/signup.html');
 }); 
 app.get('/home', function (req, res) {
   res.sendFile(__dirname+'/home.html'); 
});
app.get('/forgot', function (req, res) {
   res.sendFile(__dirname+'/forgot.html');
 });
 app.get('/reset', function (req, res) {
   res.sendFile(__dirname+'/reset.html');
 }); 

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

