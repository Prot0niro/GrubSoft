const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const router = require('./routes/router');
const mongoConfig = require('./config/mongo-config');

let app = express();

app.use(bodyParser.json());
app.use('/modules', express.static('node_modules'));
app.use(express.static('public'));
app.use('/images', express.static('images'));

let init = function () {
	router.routeApp(app);

  	http.createServer(app).listen(8888);
  	console.log("Servidor iniciado.");
}

mongoose.connect(mongoConfig.database, {
	useMongoClient: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', init);

process.on('uncaughtException', function(err) {
	console.log('Error global: ')
	console.log(err);
});
