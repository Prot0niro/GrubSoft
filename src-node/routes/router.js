const categoriaCtrl = require('./../controller/categoriaCtrl');
const comboCtrl = require('./../controller/comboCtrl');
const itemCtrl = require('./../controller/itemCtrl');
const loginCtrl = require('./../controller/loginCtrl');
const ofertaCtrl = require('./../controller/ofertaCtrl');
const registerCtrl = require('./../controller/registerCtrl');
const securityCtrl = require('./../controller/securityCtrl');
const ticketCtrl = require('./../controller/ticketCtrl');

const asyncMiddleware = require('./../middleware/asyncMiddleware');

const routeApp = (app) => {

	app.post('/register', registerCtrl.register);
	app.post('/login', loginCtrl.authenticate);

	app.all('/service/*', securityCtrl.ensureAuthenticated);

	app.delete('/service/categorias/:id', 	asyncMiddleware(categoriaCtrl.deleteDocument));
	app.delete('/service/combos/:id', 		asyncMiddleware(comboCtrl.deleteDocument));
	app.delete('/service/items/:id', 		asyncMiddleware(itemCtrl.deleteItem));
	app.delete('/service/ofertas/:id', 		asyncMiddleware(ofertaCtrl.deleteDocument));

	app.get('/service/categorias', 			asyncMiddleware(categoriaCtrl.getDocuments));
	app.get('/service/categorias/:id', 		asyncMiddleware(categoriaCtrl.getDocument));
	app.get('/service/combos', 				asyncMiddleware(comboCtrl.getDocuments));
	app.get('/service/combos/:id', 			asyncMiddleware(comboCtrl.getDocument));
	app.get('/service/items', 				asyncMiddleware(itemCtrl.getItems));
	app.get('/service/items/:id', 			asyncMiddleware(itemCtrl.getItem));
	app.get('/service/ofertas', 			asyncMiddleware(ofertaCtrl.getDocuments));
	app.get('/service/ofertas/hoy', 		asyncMiddleware(ofertaCtrl.getOfertasDeHoy));
	app.get('/service/ofertas/:id', 		asyncMiddleware(ofertaCtrl.getDocument));

	app.post('/service/categorias', 		asyncMiddleware(categoriaCtrl.createDocument));
	app.post('/service/combos', 			asyncMiddleware(comboCtrl.createDocument));
	app.post('/service/items', 				asyncMiddleware(itemCtrl.createItem));
	app.post('/service/ofertas', 			asyncMiddleware(ofertaCtrl.createDocument));
	app.post('/service/tickets', 			asyncMiddleware(ticketCtrl.generateTicket));

	app.put ('/service/categorias/:id', 	asyncMiddleware(categoriaCtrl.updateDocument));
	app.put ('/service/combos/:id', 		asyncMiddleware(comboCtrl.updateDocument));
	app.put ('/service/items/:id', 			asyncMiddleware(itemCtrl.updateItem));
	app.put ('/service/ofertas/:id', 		asyncMiddleware(ofertaCtrl.updateDocument));
}

exports.routeApp = routeApp;
