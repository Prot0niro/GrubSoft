const ItemModel = require('./../model/Item');
const errorHandler = require('./../util/error-handler');
const messages = require('./../util/messages');
const statusCodes = require('./../util/status-codes');

const itemNotFoundErr = {
	message: messages.MONG_DOC_NOT_FOUND,
	statusCode: statusCodes.NOT_FOUND
};
const invalidInputErr = {
	statusCode: statusCodes.BAD_REQUEST
};

const services = {};

services.createItem = (req, res) => {
	const itemObject = req.body;
	itemObject.creado_por = req.user.username;
	const item = new ItemModel(itemObject);

	item.save((err, savedItem) => {
		if (err) {
			errorHandler.mongooseError(err, res);
		} else {
			res.status(statusCodes.CREATED).send(savedItem);
		}
	});
};

services.getItems = (req, res) => {
	ItemModel.find((err, items) => {
		if (err) {
			errorHandler.mongooseError(err, res);
		} else {
			res.status(statusCodes.OK).send(items);
		}
	});
};

services.getItem = (req, res) => {
	const itemId = req.params.id;
	ItemModel.findById(itemId, (err, item) => {
		if (err) {
			errorHandler.mongooseError(err, res);
		} else if (!item) {
			errorHandler.generalError(itemNotFoundErr, res);
		} else {
			res.status(statusCodes.OK).send(item);
		}
	});
};

services.deleteItem = (req, res) => {
	const itemId = req.params.id;
	ItemModel.findByIdAndRemove(itemId, (err, item) => {
		if (err) {
			errorHandler.mongooseError(err, res);
		} else if (!item) {
			errorHandler.generalError(itemNotFoundErr, res);
		} else {
			res.status(statusCodes.OK).send(item);
		}
	});
};

services.updateItem = (req, res) => {
	const itemId = req.params.id;
	const body = req.body;
	checkInputBody(body, findAndUpdateItem(itemId, body, res));
};

function checkInputBody (body, cb) {
	if (body.precio && typeof body.precio !== 'number') {
		invalidInputErr.message = messages.invalidParam('precio');
		cb(invalidInputErr);
	} else {
		cb(null);
	}
}

function findAndUpdateItem (itemId, body, res) {
	return function (err) {
		if (err) {
			errorHandler.generalError(err, res)
		} else {
			ItemModel.findById(itemId, (err, item) => {
				if (err) {
					errorHandler.mongooseError(err, res);
				} else if (!item) {
					errorHandler.generalError(itemNotFoundErr, res);
				} else {
					updateItem(item, body, res);
				}
			});
		}
	};
}

function updateItem (item, body, res) {
	item.nombre = body.nombre || item.nombre;
	item.descripcion = body.descripcion || item.descripcion;
	item.precio = body.precio || item.precio;
	item.imagen = body.imagen || item.imagen;

	item.save((err, updatedItem) => {
		if (err) {
			errorHandler.mongooseError(err, res);
		} else {
			res.status(statusCodes.OK).send(updatedItem);
		}
	});
}

module.exports = services;
