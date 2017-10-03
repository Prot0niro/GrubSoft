const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const router = require('./routes/router');
const mongoConfig = require('./config/mongo-config');

let app = express();

app.use(bodyParser.json());

let init = function () {
	router.routeApp(app);

  	http.createServer(app).listen(8888);
  	console.log("Server started.");
}

mongoose.connect(mongoConfig.database);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', init);
