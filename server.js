const express = require("express");
const app = express();
const path = require('path');
const csv = require('csv-parser'); //for parsing csv
const fs = require('fs'); //filestream
const session = require ('express-session');
const flash = require('connect-flash'); //for showing messages
var chai = require('chai');
var chaiHttp = require('chai-http');

module.exports = {validatePhoneNumber, validateMultipleNumbers, app}; // for testing

app.use(session({secret: 'secret', cookie: {maxAge: 60000}, resave: false, saveUninitialized: false}))
app.use(flash())
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));//for js and css files
chai.use(chaiHttp);

app.get("/", (req, res) => {
  res.render("index", {message: req.flash('message')}); // serve views/index.ejs
 });

const possibleResults = {
    CORRECT: 'correct',
    CORRECTED: 'corrected',
    WRONG: 'wrong'
};

const storeData = (data) => {
  try {
    fs.writeFileSync('results', JSON.stringify(data))
  } catch (err) {
    console.error(err)
  }
}

function validatePhoneNumber(phoneNumber) {
  var result;
  if (!phoneNumber || !phoneNumber.length) {
    result = {
      result: possibleResults.WRONG,
      number: phoneNumber ,
      cause: 'Number empty'
    };
  } else {
    var len = phoneNumber.length;
    var numberOnlyDigits = phoneNumber.replace( /\D+/g, ''); //keep only  digits
    if (phoneNumber !== numberOnlyDigits) {
      result = {
        result: possibleResults.WRONG,
        number: phoneNumber ,
        cause: 'Phone numbers include only digit'
      };
    } else {
      if (len < 9 || len === 10) {
        result = {
          result: possibleResults.WRONG,
          number: phoneNumber ,
          cause: 'Phone number too short'
        };
      } else if (len > 11) {
        result = {
          result: possibleResults.WRONG,
          number: phoneNumber ,
          cause: 'Phone number too long'
        };
      } else if (len === 11) {
        //27 831234567 is the correct format for this exercise
        var startsWith27 = phoneNumber.substr(0, 2) === '27';
        if (len === 11 && startsWith27) {//len === 11 && startsWith27
          result  = {
            result: possibleResults.CORRECT,
            number: phoneNumber
          };
        } else {//len === 11 && !startsWith27
          result = {
            result: possibleResults.WRONG,
            number: phoneNumber ,
            cause: 'Phone number of lenght equals to 11 should start with 27'
          };
        }
      } else { //len===9
        var correctedNumber = '27'+numberOnlyDigits;
        result = {
          result: possibleResults.CORRECTED,
          number: phoneNumber,
          correctedNumber: correctedNumber
        };
      }
    }
  }
  return result;
  // in alternative use regex
}

function validateMultipleNumbers (arr) {
  if (arr && arr.length) {
    var correctNumbers = [];
    var correctedNumbers = [];
    var wrongNumbers = [];
    arr.forEach(element => {
      var originalPhoneNumber = element.sms_phone;
      var id = element.id;
      var validationResult = validatePhoneNumber(originalPhoneNumber);
      switch (validationResult.result) {
        case (possibleResults.CORRECT):
          correctNumbers.push(validationResult);
          break;
        case (possibleResults.CORRECTED):
          correctedNumbers.push(validationResult);
          break;
        case (possibleResults.WRONG):
          wrongNumbers.push(validationResult);
          break;
      }
    });
    return {
      correctNumbers: correctNumbers,
      correctedNumbers: correctedNumbers,
      wrongNumbers: wrongNumbers
    }
  } else return {error: true};
}

function loadCSVAndValidate() {
  return new Promise(function (resolve, reject) {
    var csvFilePath = 'numbers.csv';
    const csv = require('csvtojson');
    (async () => {
      const jsonObj = await csv().fromFile(csvFilePath)
      var validationResults = validateMultipleNumbers(jsonObj);
      if (validationResults && !validationResults.error) {
        storeData(validationResults);
        resolve(validationResults);
      }
      else reject();
    })();
  });
}

app.get("/validatenumber", (req, res) => {
  const phoneNumber = req.query.phoneNumber;
  var validationResult = validatePhoneNumber(phoneNumber);
  req.flash('message', validationResult);
  res.redirect('/');
});

app.get("/validateFromCSV", (req, res) => {
  loadCSVAndValidate().then((validationResults)=>{
    res.json(validationResults);
  }).catch((validationResults)=>{
    res.json({error: true});
  });
})

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
