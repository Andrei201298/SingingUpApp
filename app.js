//jshint esversion: 6

const express = require('express');
const bodyParser = require('body-parser');
const request = require("request");
const https = require("https");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", ( req, res) => {
    res.sendFile(__dirname + "/singup.html");
});

app.post("/", (req, res) => {
    const firtsName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    console.log(firtsName, lastName, email);



    const data = {
        members : [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firtsName,
                    LNAME: lastName
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);

    const url = "https://us11.api.mailchimp.com/3.0/lists/79ec73ca75";

    const options = {
        method: "POST",
        auth: "andrei1:6507ba0d0decbb5e7e009887788fcc0f-us11"
    };


    
    const request = https.request(url, options, function(response) {

        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", function(data) {
            console.log(JSON.parse(data));
        });
    });

    request.write(jsonData);
    request.end();
});

app.post("/failure", (req, res) => {
    res.redirect("/");
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running on port 3000");
});

//APIkey
//6507ba0d0decbb5e7e009887788fcc0f-us11

//List id
//79ec73ca75