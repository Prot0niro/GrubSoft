const comboCtrl = require('./../controller/comboCtrl');
const itemCtrl = require('./../controller/itemCtrl');
const loginCtrl = require('./../controller/loginCtrl');
const ofertaCtrl = require('./../controller/ofertaCtrl');
const registerCtrl = require('./../controller/registerCtrl');
const securityCtrl = require('./../controller/securityCtrl');

const routeApp = (app) => {

	app.post('/register', registerCtrl.register);
	app.post('/login', loginCtrl.authenticate);

	app.all('/service/*', securityCtrl.ensureAuthenticated);

	app.delete('/service/combos/:id', comboCtrl.deleteDocument);
	app.delete('/service/items/:id', itemCtrl.deleteItem);
	app.delete('/service/ofertas/:id', ofertaCtrl.deleteDocument);

	app.get('/service/combos', comboCtrl.getDocuments);
	app.get('/service/combos/:id', comboCtrl.getDocument);
	app.get('/service/items', itemCtrl.getItems);
	app.get('/service/items/:id', itemCtrl.getItem);
	app.get('/service/ofertas', ofertaCtrl.getDocuments);
	app.get('/service/ofertas/:id', ofertaCtrl.getDocument);

	app.post('/service/combos', comboCtrl.createDocument);
	app.post('/service/items', itemCtrl.createItem);
	app.post('/service/ofertas', ofertaCtrl.createDocument);

	app.put ('/service/combos/:id', comboCtrl.updateDocument);
	app.put ('/service/items/:id', itemCtrl.updateItem);
	app.put ('/service/ofertas/:id', ofertaCtrl.updateDocument);
}

exports.routeApp = routeApp;
