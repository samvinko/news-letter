process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
//const request = require("request");
const https = require("https");
app.use(express.json());
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/",function(req,res){
    res.sendFile(__dirname + "/sign-up.html")
});

app.post("/", function(req,res){
   const firstName =  req.body.FName;
   const lastName =  req.body.LName;
   const email = req.body.email;

   const data = {
        members: [
            {
                email_address : email,
                status : "subscribed",
                merge_fields: {
                    FNAME : firstName,
                    LNAME : lastName

                }
            }
        ]
    };

const JsonData = JSON.stringify(data);

const url = "https://us14.api.mailchimp.com/3.0/lists/c336c9cf6a";                                                      //"https://us14.api.mailshimp.com/3.0/lists/c336c9cf6a";


const options = {
    method: "POST",
    headers: { 
        Authorization : "auth dd03ccb59e5eea55b87f93bfe96ab44a-us14"
    }
};

const request = https.request(url, options, function (response) {

        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", function (data) {

                console.log(JSON.parse(data));
            });
    });

request.write(JsonData);
request.end();

});


app.post("/failure", function(req,res){
    res.redirect("/");
});


app.listen(process.env.PORT || 3000,function(){
    console.log('servereur is running on port 3000')
})
