const categoriaModel = require('./../model/Categoria');
const itemModel = require('./../model/Item');
const statusCodes = require('./../util/status-codes');

const docNotFoundErr = require('./../util/common-errors').docNotFoundErr;

const services = {};

services.createDocument = async (req, res) => {
	const doc = req.body;
	doc.creado_por = req.user.username;
	const categoria = new categoriaModel(doc);

	const savedDoc = await categoria.save();
	res.status(statusCodes.CREATED).send(savedDoc);
};

services.getDocuments = async (req, res) => {
	const categorias = await categoriaModel.find();
	res.status(statusCodes.OK).send(categorias);
};

services.getDocument = async (req, res) => {
	const categoriaId = req.params.id;
	const categoria = await categoriaModel.findById(categoriaId);
	if (!categoria) {
		throw docNotFoundErr;
	}

	res.status(statusCodes.OK).send(categoria);
};

services.deleteDocument = async (req, res) => {
	const categoriaId = req.params.id;
	const categoriaRemoved = await categoriaModel.findByIdAndRemove(categoriaId);
	if (!categoriaRemoved) {
		throw docNotFoundErr;
	}

	res.status(statusCodes.OK).send(categoriaRemoved);
};

services.updateDocument = async (req, res) => {
	const categoriaId = req.params.id;
	const body = req.body;
	body.modificado_por = req.user.username;

	const categoria = await categoriaModel.findById(categoriaId);
	if (!categoria) {
		throw docNotFoundErr;
	}

	await updateDocument(categoria, body, res);
};

async function updateDocument (categoria, body, res) {
	categoria.nombre = body.nombre || categoria.nombre;
	categoria.imagen = body.imagen || categoria.imagen;
	categoria.modificado_por = body.modificado_por;
	categoria.fecha_modificado = new Date;

	const updatedCategoria = await categoria.save();
	res.status(statusCodes.OK).send(updatedCategoria);
}

module.exports = services;
