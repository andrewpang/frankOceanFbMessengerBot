var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var app = express();
var port = process.env.PORT || 8080;

var verify_token = 'frank_ocean_bot_verify_token';
var token = "EAAOjvBQqN4QBAJ9QgjDn2gKHDIMh5ZBvNxCAzqhovR6fn4t5yx1zxThZC8nGgRAQDZAMQrheHlPOtAwjZAwV50hg12iQbN7T3ZAWToStPYZC7AHUiBoNzzQ372V9M4pbZB5M8hqs8xlSXBlwzeNfKXGPh0IhiXBqwrfi1SysIrhNgZDZD";

app.use(bodyParser.json());

app.get('/', function (req, res) {

    // res.send('Hello World! This is the bot\'s root endpoint!');
    var messaging_events = req.body.entry[0].messaging;

    for (var i = 0; i < messaging_events.length; i++) {

        var event = req.body.entry[0].messaging[i];
        var sender = event.sender.id;

        if (event.message && event.message.text) {
            var text = event.message.text;

            sendTextMessage(sender, text.substring(0, 200));
        }
    }

    res.sendStatus(200);

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

            sendTextMessage(sender, "Echo: " + text.substring(0, 200));
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