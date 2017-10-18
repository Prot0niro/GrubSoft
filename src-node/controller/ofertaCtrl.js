const ofertaModel = require('./../model/Oferta');
const itemModel = require('./../model/Item');
const errorHandler = require('./../util/error-handler');
const messages = require('./../util/messages');
const statusCodes = require('./../util/status-codes');

const updateOpts = { 
	runValidators:true,
	strict: true,
	new: true
};

const docNotFoundErr = {
	message: messages.MONG_DOC_NOT_FOUND,
	statusCode: statusCodes.NOT_FOUND
};
const invalidInputErr = {
	statusCode: statusCodes.BAD_REQUEST
};

const services = {};

services.createDocument = (req, res) => {
	const doc = req.body;
	doc.creado_por = req.user.username;
	checkNewOfertaInput(doc, (err) => {
		if (err) {
			return errorHandler.mongooseError(err, res);
		}

		const oferta = new ofertaModel(doc);

		oferta.save((errSave, savedDoc) => {
			if (errSave) {
				errorHandler.mongooseError(errSave, res);
			} else {
				res.status(statusCodes.CREATED).send(savedDoc);
			}
		});
	});
};

services.getDocuments = (req, res) => {
	ofertaModel.find((err, docs) => {
		if (err) {
			errorHandler.mongooseError(err, res);
		} else {
			res.status(statusCodes.OK).send(docs);
		}
	});
};

services.getDocument = (req, res) => {
	const ofertaId = req.params.id;
	ofertaModel.findById(ofertaId, (err, oferta) => {
		if (err) {
			errorHandler.mongooseError(err, res);
		} else if (!oferta) {
			errorHandler.generalError(docNotFoundErr, res);
		} else {
			res.status(statusCodes.OK).send(oferta);
		}
	});
};

services.deleteDocument = (req, res) => {
	const ofertaId = req.params.id;
	ofertaModel.findByIdAndRemove(ofertaId, (err, oferta) => {
		if (err) {
			errorHandler.mongooseError(err, res);
		} else if (!oferta) {
			errorHandler.generalError(docNotFoundErr, res);
		} else {
			res.status(statusCodes.OK).send(oferta);
		}
	});
};

services.updateDocument = (req, res) => {
	const ofertaId = req.params.id;
	const body = req.body;
	body.modificado_por = req.user.username;

	ofertaModel.findById(ofertaId, (err, oferta) => {
		if (err) {
			errorHandler.mongooseError(err, res);
		} else if (!oferta) {
			errorHandler.generalError(docNotFoundErr, res);
		} else {
			updateDocument(oferta, body, res);
		}
	});
};

services.getOfertasDeHoy = (req, res) => {
	ofertaModel.getOfertasDeHoy((err, ofertas) => {
		if (err) {
			return errorHandler.mongooseError(err, res);
		}

		res.status(statusCodes.OK).send(ofertas);
	});
};

function checkNewOfertaInput (body, cb) {
	if (!body.items || !body.items.length) {
		invalidInputErr.message = messages.requiredParam('items');
		return cb(invalidInputErr);
	}

	itemModel.checkIfItemsExist(body.items, cb);
}

function updateDocument (oferta, body, res) {
	oferta.nombre = body.nombre || oferta.nombre;
	oferta.descripcion = body.descripcion || oferta.descripcion;
	oferta.tipo = body.tipo || oferta.tipo;
	oferta.imagen = body.imagen || oferta.imagen;
	oferta.items = body.items || oferta.items;
	oferta.dias = body.dias || oferta.dias;
	oferta.descuento = body.descuento || oferta.descuento;
	oferta.x_por_y_x = body.x_por_y_x || oferta.x_por_y_x;
	oferta.x_por_y_y = body.x_por_y_y || oferta.x_por_y_y;
	oferta.modificado_por = body.modificado_por;
	oferta.fecha_modificado = new Date;

	oferta.save((err, updatedOferta) => {
		if (err) {
			errorHandler.mongooseError(err, res);
		} else {
			res.status(statusCodes.OK).send(updatedOferta);
		}
	});
}

module.exports = services;
