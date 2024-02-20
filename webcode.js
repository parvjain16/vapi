
const port = 2000;
const express = require('express');
const path = require('path');
const request = require('request');
const bodyParser = require('body-parser');
const app = express().use(bodyParser.json());
const requestPromise = require('request-promise');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));


// This code renders a web page when request is made to http://localhost:2000
app.listen(port, function ()
{
    console.log('Server started and listening on port 2000...');
});


app.get('/', function(req, res)
{
    res.sendFile(path.join(__dirname+'/vapi.html'));
});

// This code renders a web page when request is made to http://localhost:2000/OK
app.get('/OK', function(req, res)
{
    res.sendFile(path.join(__dirname+'/confirmation.html'));
    console.log("Console log OK");
});

// Make a call to the VAPI API when the user clicks on the button. Process the Post call and make a call to the VAPI API
app.post('/phonecall', function(req, res) {
    console.log("Phone Number to call is: ", req.body.phone_number);
    let request_body = {
            "assistant": {
                "firstMessage": "Welcome to having a fun conversation with Parv, how are you doing today?",
                "model": {
                    "provider": "openai",
                    "model": "gpt-3.5-turbo",
                    "messages": [
                        {
                            "role": "system",
                            "content": "Welcome to having a fun conversation with Parv."
                        }
                    ]
                },
                "voice": "jennifer-playht"
            },
            "phoneNumberId": "1ae7aa08-922d-465d-8cc0-01c8bc396f90",
            "customer": {
                "number": req.body.phone_number
            }
        }
        
    request({
        uri: 'https://api.vapi.ai/call/phone',

        method: 'POST',
        headers: {
            'Content-type': 'application/json',
            'Authorization': 'Bearer dff93203-21f5-4aa8-b4e5-c67a86658bb6'
        },
        json: request_body
        }, (error, response, body) => {
            if (!error && response.statusCode == 201) {
            console.log ("Received Call Status Code id: ", response.body.id);

        }
        else {
            console.log("Ran into error from VAPI API!");
            console.log(error);
        }
        }

    );

    // Redirect the user to the confirmation URL ...
    res.sendFile(path.join(__dirname+'/confirmation.html'));
    res.status(200).send('OK');
    res.end();
});