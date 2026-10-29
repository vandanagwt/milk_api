var express = require('express');
var app = express();
const https = require("https");
var mysql = require('mysql');
var bodyParser = require('body-parser');
var useragent = require('express-useragent');
const fs = require("fs");
path = require('path');
const cors = require('cors');
appRoot = __dirname;


// Many handlers run inside database callbacks, where a thrown error is not caught by Express and
// would kill the whole server. Log it and keep serving instead.
process.on('uncaughtException', function (err) {
    console.error('Uncaught exception:', err);
});
process.on('unhandledRejection', function (reason) {
    console.error('Unhandled rejection:', reason);
});

app.use(useragent.express());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true })); // support encoded bodies

// app.use(function (req, res, next) {
//     // Website you wish to allow to connect
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     // Request methods you wish to allow
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//     // Request headers you wish to allow
//     res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,token,usr_id,clnt_id,appname');
//     // Set to true if you need the website to include cookies in the requests sent
//     // to the API (e.g. in case you use sessions)
//     res.setHeader('Access-Control-Allow-Credentials', true);
//     // Pass to next layer of middleware
//     next();
// });

app.use(cors(corsOptions));
var corsOptions = {
    origin: '*', // allow your frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'], // allowed headers, including Authorization
    credentials: true // if you need to send cookies or credentials
};

app.use(logErrors);
app.use('/nodeapp', require('./routes/routes'));

var sch = require('./utils/schedules');
sch.scheduleScripts(function (err) {

});

function logErrors(err, req, res, next) {
    console.error(err.stack);
    next(err);
}

app.get('/', function (req, res) {
    res.send("Api Server ");
});

var server = app.listen(2376, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Api Server is listening at http://%s:%s', host, port);
});


// https.createServer({
//     key: fs.readFileSync('./privatekey.pem'),
//     cert: fs.readFileSync('./cert.crt'),
//     passphrase: '123456'
// }, app)
//     .listen(2376);
// console.log('ProductBase is listening at http://%s:%s 2376');