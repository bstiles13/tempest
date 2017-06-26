

const express   = require('express');
const http      = require('http');
const server    = http.createServer(app);
const path      = require('path');
const cors      = require('cors');
var bodyParser = require("body-parser");
var mongoose = require('mongoose');
var ObjectId = require('mongoose').Types.ObjectId; 


var PORT = process.env.PORT || 8080;
var app = express();
app.use(cors());


//Start MongoDB
var db = process.env.MONGODB_URI || "mongodb://localhost/tempest_db";
mongoose.connect(db, function(error) {
  if (error) {
    console.error(error);
  } else {
    console.log("mongoose connection is successful");
  }
});
var Wreck = require('./models/wreck');
var collection;

var resultsArr = [];


app.listen(PORT, function() {
  console.log('Web server listening on port ' + PORT);
});

app.use(express.static(__dirname + "/public"));


app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "./index.html"));
});


app.get('/id', function (req, res) {
  
  // var qId = new ObjectID(req.query.id);
  var qId = req.query.id;

  console.log('qid:', qId);

  Wreck.findById(qId, function(err, doc) {

    console.log('error', err);

    console.log(doc)
    var array = [];
    array.push(doc);
    res.send(array);

  })

})


app.get('/string', function (req, res) {

  console.log('hit string endpoint');

  var re = req.query.string;

  var query = {};

  var field = 'properties.history';

    var operator = {};
     
    operator['$regex'] = re;
    operator['$options'] = 'i';

    query[field] = operator;

    resultsArr = Wreck.find(query);

    
    resultsArr.then(function(arr) {
      var array = [];
      array.push(arr);
      res.send(array);

    })

})


app.get('/all', function (req, res) {


  Wreck.find({}, function( err, docs) {
      var array = [];
      array.push(docs);
      resultsArr.push(array);

    });

    res.send(resultsArr);

});


app.get('/range', function (req, res) {

  console.log('range endpoint hit');

  var before = parseInt(req.query.before);
  var after = parseInt(req.query.after);

  resultsArr = Wreck.find(
    {
      "properties.yearsunk": { $gt: after, $lt: before }
    }
    )

  resultsArr.then(function(arr) {
    var array = [];
    array.push(arr);
    console.log(arr);

    res.send(array);

  })

})


app.get('/wreck', function(req, res) {

  console.log('hit wreck endpoint');

  var query = {};


  if(req.query.string) {

    var re = req.query.string;

    var field = 'properties.history';

    var operator = {};
     
    operator['$regex'] = re;
    operator['$options'] = 'i';

    query[field] = operator;

  }


  if(req.query.before && req.query.after) {

    var before = parseInt(req.query.before);
    var after = parseInt(req.query.after);

    var field = 'properties.yearsunk';

    var operator = {};
     
    operator['$lt'] = before;
    operator['$gt'] = after;

    query[field] = operator;

  }

  if(req.query.before && !req.query.after) {
    
    var before = parseInt(req.query.before);
    var field = 'properties.yearsunk';

    var operator = {};
    operator['$lt'] = before;

    query[field] = operator;

  }

  if(req.query.after && !req.query.before) {
    
    var after = parseInt(req.query.after);
    var field = 'properties.yearsunk';

    var operator = {};
    operator['$gt'] = after;

    query[field] = operator;

  }


  if(req.query.location.lat && req.query.location.lon && req.query.location.radius) {
    
    var field = 'geometry';

    var operator1 = {};
    var operator2 = {};
    var operator3 = {};

    operator3['type'] = "Point";
    operator3['coordinates'] = [ parseFloat(req.query.location.lon), parseFloat(req.query.location.lat) ];

    operator2['$geometry'] = operator3;

    operator2['$maxDistance'] = parseFloat(req.query.location.radius);

    operator1['$near'] = operator2;

    query[field] = operator1;

  };


  if(parseInt(req.query.hasName) === 1) { 

    var field = 'properties.vesslterms';

    var operator = {};
    operator['$nin'] = ["", "UNKNOWN", "WRECK"];

    query[field] = operator;

  };

  
  if(req.query.name){
  
    var field = 'properties.vesslterms';

    query[field] = req.query.name;
  
  }


  resultsArr = Wreck.find(query);


  resultsArr.then(function(arr) {
    var array = [];
    array.push(arr);
    res.send(array);

  })

})


app.get('/hasname', function (req, res) {


  resultsArr = Wreck.find(
    {
      "properties.vesslterms" : { $nin: ["", "UNKNOWN", "WRECK"] }   
    }
    )


  resultsArr.then(function(arr) {
    var array = [];
    array.push(arr);
    res.send(array);

  })


})


app.get('/name', function (req, res) {

  var shipName = req.query.name;

  resultsArr = Wreck.find(
    {
      "properties.vesslterms": shipName.toUpperCase()
    }
    );

  resultsArr.then(function(arr) {
    var array = [];
    array.push(arr);
    res.send(array);

  })

})


app.get('/proximity', function (req, res) {

 	var lat = parseFloat(req.query.lat);
	var lon = parseFloat(req.query.lon);
	var radius = parseFloat(req.query.radius);

  var resultsArr = Wreck.find( 

          {
          	"geometry" : {
          		
          		$near : { 

          			$geometry : {
          			
  	        			type : "Point" ,
  	        			coordinates : [ lon, lat ]
  	        		},

          			$maxDistance : radius
         			}

         		}

          },
          
          { 

          }
          )

  resultsArr.then(function(arg) {
    var array = [];
    array.push(arg);
    res.send(array);

  });

})


