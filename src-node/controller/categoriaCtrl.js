const categoriaModel = require('./../model/Categoria');
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
	const categoria = new categoriaModel(doc);

	categoria.save((errSave, savedDoc) => {
		if (errSave) {
			errorHandler.mongooseError(errSave, res);
		} else {
			res.status(statusCodes.CREATED).send(savedDoc);
		}
	});
};

services.getDocuments = (req, res) => {
	categoriaModel.find((err, docs) => {
		if (err) {
			errorHandler.mongooseError(err, res);
		} else {
			res.status(statusCodes.OK).send(docs);
		}
	});
};

services.getDocument = (req, res) => {
	const categoriaId = req.params.id;
	categoriaModel.findById(categoriaId, (err, categoria) => {
		if (err) {
			errorHandler.mongooseError(err, res);
		} else if (!categoria) {
			errorHandler.generalError(docNotFoundErr, res);
		} else {
			res.status(statusCodes.OK).send(categoria);
		}
	});
};

services.deleteDocument = (req, res) => {
	const categoriaId = req.params.id;
	categoriaModel.findByIdAndRemove(categoriaId, (err, categoria) => {
		if (err) {
			errorHandler.mongooseError(err, res);
		} else if (!categoria) {
			errorHandler.generalError(docNotFoundErr, res);
		} else {
			res.status(statusCodes.OK).send(categoria);
		}
	});
};

services.updateDocument = (req, res) => {
	const categoriaId = req.params.id;
	const body = req.body;
	body.modificado_por = req.user.username;

	categoriaModel.findById(categoriaId, (err, categoria) => {
		if (err) {
			errorHandler.mongooseError(err, res);
		} else if (!categoria) {
			errorHandler.generalError(docNotFoundErr, res);
		} else {
			updateDocument(categoria, body, res);
		}
	});
};

function updateDocument (categoria, body, res) {
	categoria.nombre = body.nombre || categoria.nombre;
	categoria.imagen = body.imagen || categoria.imagen;
	categoria.modificado_por = body.modificado_por;
	categoria.fecha_modificado = new Date;

	categoria.save((err, updatedCategoria) => {
		if (err) {
			errorHandler.mongooseError(err, res);
		} else {
			res.status(statusCodes.OK).send(updatedCategoria);
		}
	});
}

module.exports = services;
