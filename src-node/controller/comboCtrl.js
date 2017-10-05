const comboModel = require('./../model/Combo');
const itemModel = require('./../model/Item');
const errorHandler = require('./../util/error-handler');
const messages = require('./../util/messages');
const statusCodes = require('./../util/status-codes');

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
	checkNewComboInput(doc, (err) => {
		if (err) {
			return errorHandler.mongooseError(err, res);
		}

		const combo = new comboModel(doc);

		combo.save((errSave, savedDoc) => {
			if (errSave) {
				errorHandler.mongooseError(errSave, res);
			} else {
				res.status(statusCodes.CREATED).send(savedDoc);
			}
		});
	});
};

services.getDocuments = (req, res) => {
	comboModel.find((err, docs) => {
		if (err) {
			errorHandler.mongooseError(err, res);
		} else {
			res.status(statusCodes.OK).send(docs);
		}
	});
};

services.getDocument = (req, res) => {
	const comboId = req.params.id;
	comboModel.findById(comboId, (err, combo) => {
		if (err) {
			errorHandler.mongooseError(err, res);
		} else if (!combo) {
			errorHandler.generalError(docNotFoundErr, res);
		} else {
			res.status(statusCodes.OK).send(combo);
		}
	});
};

services.deleteDocument = (req, res) => {
	const comboId = req.params.id;
	comboModel.findByIdAndRemove(comboId, (err, combo) => {
		if (err) {
			errorHandler.mongooseError(err, res);
		} else if (!combo) {
			errorHandler.generalError(docNotFoundErr, res);
		} else {
			res.status(statusCodes.OK).send(combo);
		}
	});
};

services.updateDocument = (req, res) => {
	const comboId = req.params.id;
	const body = req.body;
	body.modificado_por = req.user.username;

	comboModel.findById(comboId, (err, combo) => {
		if (err) {
			errorHandler.mongooseError(err, res);
		} else if (!combo) {
			errorHandler.generalError(docNotFoundErr, res);
		} else {
			updateDocument(combo, body, res);
		}
	});
};

function checkNewComboInput (body, cb) {
	if (!body.items || !body.items.length) {
		invalidInputErr.message = messages.requiredParam('items');
		return cb(invalidInputErr);
	}

	itemModel.checkIfItemsExist(body.items, cb);
}

function updateDocument (combo, body, res) {
	combo.nombre = body.nombre || combo.nombre;
	combo.descripcion = body.descripcion || combo.descripcion;
	combo.precio = body.precio || combo.precio;
	combo.imagen = body.imagen || combo.imagen;
	combo.items = body.items || combo.items;
	combo.modificado_por = body.modificado_por;
	combo.fecha_modificado = new Date;

	combo.save((err, updatedCombo) => {
		if (err) {
			errorHandler.mongooseError(err, res);
		} else {
			res.status(statusCodes.OK).send(updatedCombo);
		}
	});
}

module.exports = services;
