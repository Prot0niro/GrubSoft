const categoriaCtrl = require('./../controller/categoriaCtrl');
const comboCtrl = require('./../controller/comboCtrl');
const itemCtrl = require('./../controller/itemCtrl');
const loginCtrl = require('./../controller/loginCtrl');
const ofertaCtrl = require('./../controller/ofertaCtrl');
const registerCtrl = require('./../controller/registerCtrl');
const securityCtrl = require('./../controller/securityCtrl');
const ticketCtrl = require('./../controller/ticketCtrl');
const userCtrl = require('./../controller/userCtrl');

const asyncMiddleware = require('./../middleware/asyncMiddleware');

const routeApp = (app) => {

	app.post('/register', registerCtrl.register);
	app.post('/login', loginCtrl.authenticate);

	app.all('/service/*', securityCtrl.ensureAuthenticated);
	app.all('/service/admin/*', securityCtrl.ensureIsAdmin);

	app.get		('/service/user/admin', 			userCtrl.isUserAdmin);

	app.get		('/service/categorias', 			asyncMiddleware(categoriaCtrl.getDocuments));
	app.get		('/service/categorias/:id', 		asyncMiddleware(categoriaCtrl.getDocument));
	app.get		('/service/combos', 				asyncMiddleware(comboCtrl.getDocuments));
	app.get		('/service/combos/:id', 			asyncMiddleware(comboCtrl.getDocument));
	app.get		('/service/items', 					asyncMiddleware(itemCtrl.getItems));
	app.get		('/service/items/:id', 				asyncMiddleware(itemCtrl.getItem));
	app.get		('/service/ofertas', 				asyncMiddleware(ofertaCtrl.getDocuments));
	app.get		('/service/ofertas/hoy', 			asyncMiddleware(ofertaCtrl.getOfertasDeHoy));
	app.get		('/service/ofertas/:id', 			asyncMiddleware(ofertaCtrl.getDocument));

	app.post	('/service/tickets', 				asyncMiddleware(ticketCtrl.nuevaCompra));

	app.put		('/service/items/:id', 				asyncMiddleware(itemCtrl.updateItem));

	app.delete	('/service/admin/categorias/:id', 	asyncMiddleware(categoriaCtrl.deleteDocument));
	app.delete	('/service/admin/combos/:id', 		asyncMiddleware(comboCtrl.deleteDocument));
	app.delete	('/service/admin/items/:id', 		asyncMiddleware(itemCtrl.deleteItem));
	app.delete	('/service/admin/ofertas/:id', 		asyncMiddleware(ofertaCtrl.deleteDocument));

	app.post	('/service/admin/categorias', 		asyncMiddleware(categoriaCtrl.createDocument));
	app.post	('/service/admin/combos', 			asyncMiddleware(comboCtrl.createDocument));
	app.post	('/service/admin/items', 			asyncMiddleware(itemCtrl.createItem));
	app.post	('/service/admin/ofertas', 			asyncMiddleware(ofertaCtrl.createDocument));

	app.put		('/service/admin/categorias/:id', 	asyncMiddleware(categoriaCtrl.updateDocument));
	app.put		('/service/admin/combos/:id', 		asyncMiddleware(comboCtrl.updateDocument));
	app.put		('/service/admin/ofertas/:id', 		asyncMiddleware(ofertaCtrl.updateDocument));
}

exports.routeApp = routeApp;
