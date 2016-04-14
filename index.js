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

            if(whenIsAlbumOut(sender, text.toLowerCase())){ break;  }
            else if(willAlbumOut(sender, text.toLowerCase())){ break; } 
            else if(isAlbumOut(sender, text.toLowerCase())){ break; } 
            else if(showMeMusicVideos(sender, text.toLowerCase())){ break; }
            else if(knowAboutLonny(sender, text.toLowerCase())){ break; }
            else if(thinkingAboutYou(sender, text.toLowerCase())){ break; }
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
    var responses = [
        "This is weird, I don't know what to say",
        "Uhh...what?",
        "Say that again, please",
        "I'm not sure how to respond to that",
        "Here read this: http://pigeonsandplanes.com/2016/04/frank-ocean-timeline/",
        "What do you think my brain is made for, is it just a container for the mind?",
        "What if the sky and the stars are for show and the aliens are watching live?",
        "What are you, Hemingway?"
    ];
    var randomNumber = Math.floor(Math.random()*responses.length);
    var response = responses[randomNumber];

    sendTextMessage(sender, response);
}

function willAlbumOut(sender, text){
    var responses = [
    'It should',
    'I hope so',
    'Who really knows?',
    'It better!'
    ];
    var randomNumber = Math.floor(Math.random()*responses.length);
    var response = responses[randomNumber];

    if(text.indexOf("will") == 0){
        sendTextMessage(sender, response);
        return true;
    }
    return false;
}

function isAlbumOut(sender, text){
    var responses = [
    'Nope, unfortunately',
    'I wish',
    'No ;(',
    'I want to tell you yes, but I can\'t lie',
    'It\'s not out yet',
    'Ughhh no',
    'Wait...is this a leak? https://youtu.be/dQw4w9WgXcQ'
    ];
    var randomNumber = Math.floor(Math.random()*responses.length);
    var response = responses[randomNumber];

    if(text.indexOf("album out") > -1){
        sendTextMessage(sender, response);
        return true;
    }
    if(text.indexOf("leaked") > -1){
        sendTextMessage(sender, response);
        return true;
    }
    if(text.indexOf("has the album come out") > -1){
        sendTextMessage(sender, response);
        return true;
    }
    if(text.indexOf("has it come out") > -1){
        sendTextMessage(sender, response);
        return true;
    }
    if(text.indexOf("did it come out") > -1){
        sendTextMessage(sender, response);
        return true;
    }
    if(text.indexOf("did the album come out") > -1){
        sendTextMessage(sender, response);
        return true;
    }
    if(text.indexOf("out yet") > -1){
        sendTextMessage(sender, response);
        return true;
    }
    if(text.indexOf("released") > -1){
        sendTextMessage(sender, response);
        return true;
    }
    return false;
}

function whenIsAlbumOut(sender, text){
    var responses = [
    'I don\'t know', 
    'I wish I knew', 
    'I heard it was coming out in Nevuary', 
    'Hopefully soon',
    'Type "Tell me when the album comes out" and I\'ll let you know!'
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
    if(text.indexOf("what day") > -1){
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
            "subtitle": "And I've got this black suit on",
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

    pyramidsData = {
      "attachment": {
        "type": "template",
        "payload": {
          "template_type": "generic",
          "elements": [{
            "title": "Pyramids",
            "subtitle": "This video is so good",
            "image_url": "https://www.google.com/url?sa=i&rct=j&q=&esrc=s&source=images&cd=&cad=rja&uact=8&ved=0ahUKEwjkr7y3mY3MAhVY62MKHWCDC3oQjRwIBw&url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3D2PPYndfEPHA&psig=AFQjCNE5A5_C99NbwbjPnTqnz2l5SOEYnA&ust=1460691336615801",
            "buttons": [{
              "type": "web_url",
              "url": "http://vevo.ly/PBbPoP",
              "title": "Watch Music Video"
            }],
          }]
        }
      }
    };

    musicVideos.push(swimGoodData);
    musicVideos.push(pyramidsData);

    var randomNumber = Math.floor(Math.random()*musicVideos.length);
    var randomVideo = musicVideos[randomNumber];

    if(text.indexOf("swim good") > -1){
        sendGenericMessage(sender, swimGoodData);
        return true;
    }
    if(text.indexOf("pyramids") > -1){
        sendGenericMessage(sender, pyramidsData);
        return true;
    }
    if(text.indexOf("music video") > -1){
        sendTextMessage(sender, "Watch this")
        sendGenericMessage(sender, randomVideo);
        return true;
    }
    return false;
}

function knowAboutLonny(sender, text){
    if(text.indexOf("lonny") > -1){
        sendTextMessage(sender, "Oh, you know about Lonny?");
        return true;
    }
    return false;
}

function thinkingAboutYou(sender, text){
    var responses = [
        'Thinking bout you too',
        'Oooh no, no',
        'Do you think about me still?',
        "I've been thinking bout forever",
        'Do you not think so far ahead?'
    ];
    var randomNumber = Math.floor(Math.random()*responses.length);
    var response = responses[randomNumber];

    if(text.indexOf("thinkin bout you") > -1){
        sendTextMessage(sender, response);
        return true;
    }
    if(text.indexOf("thinking about you") > -1){
        sendTextMessage(sender, response);
        return true;
    }
    if(text.indexOf("thinking bout you") > -1){
        sendTextMessage(sender, response);
        return true;
    }
    if(text.indexOf("thinkin about you") > -1){
        sendTextMessage(sender, response);
        return true;
    }
    return false;
}


