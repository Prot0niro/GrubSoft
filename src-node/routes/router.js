const securityCtrl = require('./../controller/securityCtrl');
const registerCtrl = require('./../controller/registerCtrl');
const loginCtrl = require('./../controller/loginCtrl');
const testCtrl = require('./../controller/testCtrl');

const routeApp = function (app) {

	app.get('/', function (req, res) {
		res.send('Hello World');
	});

	app.all('/service/*', securityCtrl.ensureAuthenticated);

	app.get('/service/test', testCtrl.test);

	app.post('/register', registerCtrl.register);

	app.post('/login', loginCtrl.authenticate);
}

exports.routeApp = routeApp;
