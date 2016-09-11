var express = require('express');
var firebase = require('firebase');
var Translate = require('@google-cloud/translate');
var bodyParser = require('body-parser');
var app = express();
var config = {
    apiKey: "AIzaSyCa1TSayY_Fqn9nrTXU8WqVwQSjdBF5haQ",
    authDomain: "pspeakapp.firebaseapp.com",
    databaseURL: "https://pspeakapp.firebaseio.com",
    storageBucket: "",
};


app.use(bodyParser.urlencoded({
  extended: true
}))

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.json());

var firebaseApp = firebase.initializeApp(config);
var textRef = firebase.database().ref();

app.post('/translate', function(req, res, next) {
  // translate endpoint!
  // use the req to recognize what language you need to translate to
  // use req to eventually recognize the language you want to translate FROM
  textRef.once('value', function(data) {
    let text = data.val().original_text;
    console.log('translate this text', text);
    let language = req.body.language;
    let voice = '';
    // switch Spanish, French, German, Tagalog, Mandarin
    // translate language into code
    if (language == 'spanish') {
      language = 'es'
    }
    if (language == 'french') {
      language = 'fr'
    }
    if (language == 'german') {
      language = 'de'
    }
    if (language == 'filipino') {
      language = 'tl'
    }

    console.log('into this language', language);

    let translate = Translate({
      key: 'AIzaSyDXZS-_PJySN03yrO64Y-qCdiUtklFRblY'
    })

    // english = 'en'
    translate.translate(text, {
      from: 'en',
      to: language
    }, function(err, translation, apiResponse) {
      if (err) {
        console.log('err', err);
      }

      // // // console.log('Translate to %s:', ISO6391.getName(language));
      console.log('translation', translation);

      // if used one more time, make a helper method for duplicate code.
      textRef.update({original_text: text});
      textRef.update({text: translation});
    })
  })
  // translate the text from firebase and resave it as the translated text
});

app.listen(process.env.PORT || '3001', function(){
  console.log(`Express server listening on port ${this.address().port} in ${app.settings.env} mode`);
});
