var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var app = express();
var port = process.env.PORT || 8080;

var verify_token = 'frank_ocean_bot_verify_token';
var token = "EAAOjvBQqN4QBAOGDAXiZC2knutUQagevrf5u6FIIRlnTaazevA8plywpF7KHzUn0ZCdpKn4ZApfjS5jd9Cj2qCasYV2KVN1n7i7JHKKZCbywLgvXKVyzMwMVHy6JA4tSui5fV1H3rbXb2hbVOzs3twd9484CONinUt7qaAoKJgZDZD";

app.use(bodyParser.json());

app.get('/', function (req, res) {

    res.send('Hello World! This is the bot\'s root endpoint!');

});

app.get('/webhook/', function (req, res) {

    if (req.query['hub.verify_token'] === verify_token) {
        res.send(req.query['hub.challenge']);
    }

    res.send('Error, wrong validation token');

});

app.post('/webhook/', function (req, res) {

    var messaging_events = req.body.entry[0].messaging;

    for (var i = 0; i < messaging_events.length; i++) {

        var event = req.body.entry[0].messaging[i];
        var sender = event.sender.id;

        if (event.message && event.message.text) {
            var text = event.message.text;

            if(isAlbumOut(sender, text.toLowerCase())){ break;  }
            else if(whenIsAlbumOut(sender, text.toLowerCase())){ break; } 
            else if(showMeMusicVideos(sender, text.toLowerCase())){ break; }
            else{
                randomResponse(sender, text);
            }
        }


    }

    res.sendStatus(200);

});

app.listen(port, function () {

    console.log('Facebook Messenger echoing bot started on port' + port);

});


function sendTextMessage(sender, text) {

    var messageData = {
        text: text
    };

    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: token},
        method: 'POST',
        json: {
            recipient: {id: sender},
            message: messageData
        }
    }, function (error, response) {

        if (error) {
            console.log('Error sending message: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }

    });

}

function sendGenericMessage(sender, messageData) {
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token:token},
    method: 'POST',
    json: {
      recipient: {id:sender},
      message: messageData,
    }
  }, function(error, response, body) {
    if (error) {
      console.log('Error sending message: ', error);
    } else if (response.body.error) {
      console.log('Error: ', response.body.error);
    }
  });
}

function randomResponse(sender, text){
    sendTextMessage(sender, "Echo: " + text.substring(0, 200));
}

function isAlbumOut(sender, text){
    var responses = [
    'Nope',
    'No',
    'I wish',
    'No ;(',
    'I want to tell you yes, but I can\'t lie',
    'It\'s not out yet',
    'Ughhh no'
    'Wait...is this a leak? https://youtu.be/dQw4w9WgXcQ'
    ];
    var randomNumber = Math.floor(Math.random()*responses.length);
    var response = responses[randomNumber];

    if(text.indexOf("album out") > -1){
        sendTextMessage(sender, response);
        return true;
    }
    if(text.indexOf("album released") > -1){
        sendTextMessage(sender, response);
        return true;
    }
    if(text.indexOf("album leaked") > -1){
        sendTextMessage(sender, response);
        return true;
    }
    if(text.indexOf("has it come out") > -1){
        sendTextMessage(sender, response);
        return true;
    }
    if(text.indexOf("album leaked") > -1){
        sendTextMessage(sender, response);
        return true;
    }
    return false;
}

function whenIsAlbumOut(sender, text){
    var responses = [
    'IDK', 
    'I really wish I knew', 
    'I heard it was coming out in Nevuary', 
    'Hopefully soon'
    ];
    var randomNumber = Math.floor(Math.random()*responses.length);
    var response = responses[randomNumber];

    if(text.indexOf("when is") > -1){
        sendTextMessage(sender, response);
        return true;
    }
    if(text.indexOf("when will") > -1){
        sendTextMessage(sender, response);
        return true;
    }
    return false;
}

function showMeMusicVideos(sender, text){
    var musicVideos = [];

    swimGoodData = {
      "attachment": {
        "type": "template",
        "payload": {
          "template_type": "generic",
          "elements": [{
            "title": "Swim Good",
            "subtitle": "From Nostalgia, Ultra",
            "image_url": "https://i.ytimg.com/vi/7Wp4m-FbBBw/maxresdefault.jpg",
            "buttons": [{
              "type": "web_url",
              "url": "https://youtu.be/PmN9rZW0HGo",
              "title": "Watch Music Video"
            }],
          }]
        }
      }
    };

    musicVideos.push(swimGoodData);

    if(text.indexOf("swim good") > -1){
        sendGenericMessage(sender, swimGoodData);
        return true;
    }
    return false;
}

