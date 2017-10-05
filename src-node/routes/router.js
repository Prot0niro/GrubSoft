const securityCtrl = require('./../controller/securityCtrl');
const registerCtrl = require('./../controller/registerCtrl');
const loginCtrl = require('./../controller/loginCtrl');
const itemCtrl = require('./../controller/itemCtrl');

const routeApp = function (app) {

	app.post('/register', registerCtrl.register);
	app.post('/login', loginCtrl.authenticate);

	app.all('/service/*', securityCtrl.ensureAuthenticated);

	app.delete('/service/items/:id', itemCtrl.deleteItem);

	app.get('/service/items', itemCtrl.getItems);
	app.get('/service/items/:id', itemCtrl.getItem);

	app.post('/service/items', itemCtrl.createItem);

	app.put ('/service/items/:id', itemCtrl.updateItem);
}

exports.routeApp = routeApp;
