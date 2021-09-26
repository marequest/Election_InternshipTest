const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const cors=require("cors");
const corsOptions ={
    origin:'*',
    credentials:true,
    optionSuccessStatus:200,
}
app.use(cors(corsOptions))

const fs = require('fs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// this is where we'll handle our various routes from
const routes = require('./routes/routes.js')(app, fs);

// launch our server on port 3001.
const server = app.listen(3001, () => {
    console.log('listening on port %s...', server.address().port);
});