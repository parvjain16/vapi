const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 2000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, function () {
    console.log(`Server started and listening on port ${PORT}...`);
});

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'vapi.html'));
});

app.get('/OK', function (req, res) {
    res.sendFile(path.join(__dirname, 'confirmation.html'));
    console.log("Console log OK");
});

app.post('/phonecall', function (req, res) {
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
    };

    fetch('https://api.vapi.ai/call/phone', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer dff93203-21f5-4aa8-b4e5-c67a86658bb6'
        },
        body: JSON.stringify(request_body)
    })
    .then(response => response.json())
    .then(data => {
        console.log("Received Call Status Code id: ", data.id);
        res.sendFile(path.join(__dirname, 'confirmation.html'));
        res.status(200).send('OK');
    })
    .catch(error => {
        console.log("Ran into error from VAPI API!");
        console.error(error);
        res.status(500).send('Internal Server Error');
    });
});
