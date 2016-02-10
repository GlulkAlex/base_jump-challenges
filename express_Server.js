"use strict";

const is_DEBUG = (
  true
  //false
);

const express = require('express');
const path = require('path');
//const bodyparser = require('body-parser');

var app = express();
//var router = express.Router(/*[options]*/);

const end_Point_Root = '/';
const end_Point_Home = '/home';
const end_Point_Search = '/search';
const port = (
    process.argv[2] || 
    process.env.PORT || 
    8080 ||
    3000
);
const source_Path_Directory = (
    process.argv[3] || 
    end_Point_Root ||
    end_Point_Home ||
    __dirname + '/public'
);
const months = [
  'January',//	31 days
  'February',//	28 days, 29 in leap years
  'March',//	31 days
  'April',//	30 days
  'May',//	31 days
  'June',//	30 days
  'July',//	31 days
  'August',//	31 days
  'September',//	30 days
  'October',//	31 days
  'November',//	30 days
  'December'
];

//
// The Unix time number is zero at the Unix `epoch`, and 
// increases by exactly `86400` per day since the `epoch`.
//
function date_From_Unix_Time_Number(unix_TimeStamp) {
  const unix_Day = 86400;
  const unix_Hour = 3600;//unix_Day / 24 = 86400 / 24;
  const unix_Minute = 60;//unix_Hour / 60;
  const unix_Second = 1;//unix_Minute / 60
  var days_Before_Epoch = 0;// if unix_TimeStamp < 0
  var days_After_Epoch = 0;// if unix_TimeStamp >= 0
  // The Unix `epoch` is 
  // the time 00:00:00 UTC on 1 January 1970.
  const unix_Epoch = new Date(0);
  //Thu Jan 01 1970 05:00:00 GMT+0500 (SVET)
  //var n = d.toDateString();
  // The result of n will be:
  //Wed Feb 10 2016
  // millisecond -> one thousandth of a second
  
  return new Date(unix_TimeStamp * 1000);
}
      
if (false) {
app
.get(
    end_Point_Root, 
    function(
        req, 
        res//, next
    ) {
      //res.end('Hello World!');
      // req.query.NAME: undefined
      //console.log(`req.query.NAME: ${req.query.NAME}`);
      // req.query: [object Object]
      /*
        req.query.results: recent
        req.query.type: quote
        req.query.page: 6
      */
      if (false) {
          console.log(`req.query: ${req.query}`);
          
          for (var attr in req.query) {
             console.log(`req.query.${attr}: ${req.query[attr]}`); 
          }
      }
      if (is_DEBUG) {
        console.log(`'req.url': ${req.url}`);
        console
        .log(
          "req.query:\n" +
          JSON
          .stringify(req.query)
        );
      }
      
      res
      .send(
        //object
        /*
        req.query
        An `object` containing 
        a property 
        for each `query` string `parameter` 
        in the `route`. 
        If there is 
        no `query` string, 
        it is 
        the `empty` `object`, {}.

        // GET /search?q=tobi+ferret
        req.query.q
        // => "tobi ferret"
        
        // GET /shoes?order=desc&shoe[color]=blue&shoe[type]=converse
        req.query.order
        // => "desc"
        
        req.query.shoe.color
        // => "blue"
        
        req.query.shoe.type
        // => "converse"
        */
        req.query
      );
      //next();
    }
);
}

app
.all(
  '/*', 
  function (
    req, 
    res, 
    next
  ) {
    console.log('Accessing the secret section ...');
    //path.basename('/foo/bar/baz/asdf/quux.html')
    const path_BaseName = path.basename(req.url);
    // cases:
    // 1) number, ms <- unix timestamp
    // 2) date formatted string <- natural language date
    // 3) something else -> {"unix":null,"natural":null}
    var json_Response_Obj = {"unix":null,"natural":null};
    var timeStamp_Date = null;
    var milliseconds;
    var iso_Date = null;//{};
    //->:parseInt("14501376A00")
    //<-:14501376
    //>:parseInt("?14501376A00")
    //<:NaN
    // or
    //>:+"?14501376A00"
    //<:NaN
    //>:typeof NaN                    
    //<:Returns number
    //NaN
    //NaN#toNumb -> NaN	
    //NaN#toStr -> "NaN"	
    //NaN#toBool -> false
    /* so, ? regEx ?*/
    //if (+"14501376A00"){"OK"}else{"fail"}
    //"fail"
    //if (+"1450137600"){"OK"}else{"fail"}
    //"OK"
    // or
    //isNaN("14501376A00")
    //true
    //isNaN("1450137600")
    //false
    if (+path_BaseName){
      //"OK"
      //var msec = Date.parse("March 21, 2012");
      //var d = new Date(msec);
      json_Response_Obj.unix = +path_BaseName;
      //
      // The Unix time number is zero at the Unix `epoch`, and 
      // increases by exactly `86400` per day since the `epoch`.
      //
      
      //Date.toLocaleDateString()
      timeStamp_Date = new Date(+path_BaseName * 1000);
      json_Response_Obj.natural = (
        months[timeStamp_Date.getMonth()] + " " + 
        timeStamp_Date.getDate() + ", " +
        timeStamp_Date.getFullYear()
      );
    }else{
      //"fail"
      try {
        milliseconds = Date.parse(decodeURIComponent(path_BaseName));
        
      } catch(err) {
        console.log(`Date parse: ${err}`);
      }
      // null:	#toNumb == 0	#toStr == "null"	#toBool == false
      if (milliseconds) {
        try {
          iso_Date = new Date(milliseconds);
          
        } catch(err) {
          console.log(`Date creation error: ${err}`);
        }
        json_Response_Obj.unix = iso_Date * 0.001
        json_Response_Obj.natural = months[iso_Date.getMonth()] + " " + 
        iso_Date.getDate() + ", " +
        iso_Date.getFullYear();
      } else {
        json_Response_Obj.unix = null
        json_Response_Obj.natural = null//iso_Date
      }
    }
    
    if (is_DEBUG) {
        console.log(`'req.url': ${req.url}`);
      console.log(`'path.basename': ${path_BaseName}`);
      console.log(
        'decodeURIComponent(path_BaseName):', 
        decodeURIComponent(path_BaseName)
      );
      // iso_Date: Invalid Date
      console.log(`iso_Date: ${iso_Date}`);
    }
    
    res
    .json(
      //null
      json_Response_Obj
    );
    if (is_DEBUG) {
        console.log("json_Response_Obj:\n" +
          JSON
          .stringify(json_Response_Obj));
    }
    // pass control to the next handler
    next(); 
  }
);

/*##########################################################################*/
/* unit test */
app
.listen(
  port,
  function () {
  	console
  	.log('http_Server listening on port ' + port + '...');
  }
);