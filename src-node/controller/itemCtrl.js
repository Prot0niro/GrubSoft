const ItemModel = require('./../model/Item');
const categoriaModel = require('./../model/Categoria');
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

	categoriaModel.findById(item.categoria, checkIfCategoriaExists(itemObject, res));
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
	body.modificado_por = req.user.username;

	ItemModel.findById(itemId, (err, item) => {
		if (err) {
			errorHandler.mongooseError(err, res);
		} else if (!item) {
			errorHandler.generalError(itemNotFoundErr, res);
		} else {
			updateItem(item, body, res);
		}
	});
};

function checkIfCategoriaExists (itemObject, res) {
	return function (err) {
		if (err) {
			return errorHandler.mongooseError(err, res)
		}

		const item = new ItemModel(itemObject);
		item.save((err, savedItem) => {
		if (err) {
			errorHandler.mongooseError(err, res);
		} else {
			res.status(statusCodes.CREATED).send(savedItem);
		}
	});
	}
}

function updateItem (item, body, res) {
	item.nombre = body.nombre || item.nombre;
	item.descripcion = body.descripcion || item.descripcion;
	item.precio = body.precio || item.precio;
	item.imagen = body.imagen || item.imagen;
	item.guiso = body.guiso || item.guiso;
	item.categoria = body.categoria || item.categoria;
	item.modificado_por = body.modificado_por;
	body.fecha_modificado = new Date;

	item.save((err, updatedItem) => {
		if (err) {
			errorHandler.mongooseError(err, res);
		} else {
			res.status(statusCodes.OK).send(updatedItem);
		}
	});
}

module.exports = services;
