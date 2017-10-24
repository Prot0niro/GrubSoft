const ItemModel = require('./../model/Item');
const categoriaModel = require('./../model/Categoria');
const messages = require('./../util/messages');
const statusCodes = require('./../util/status-codes');

const docNotFoundErr = require('./../util/common-errors').docNotFoundErr;
const invalidInputErr = require('./../util/common-errors').invalidInputErr;

const services = {};

services.createItem = async (req, res) => {
	const input = req.body;

	await checkNewItemInput(input);

	input.creado_por = req.user.username;
	const item = new ItemModel(input);
	const savedItem = await item.save();
	res.status(statusCodes.CREATED).send(savedItem);
};

services.getItems = async (req, res) => {
	const items = await ItemModel.find();
	res.status(statusCodes.OK).send(items);
};

services.getItem = async (req, res) => {
	const itemId = req.params.id;
	const item = await ItemModel.findById(itemId);
	if (!item) {
		throw docNotFoundErr;
	}

	res.status(statusCodes.OK).send(item);
};

services.deleteItem = async (req, res) => {
	const itemId = req.params.id;
	const item = await ItemModel.findByIdAndRemove(itemId);
	if (!item) {
		throw docNotFoundErr;
	}

	res.status(statusCodes.OK).send(item);
};

services.updateItem = async (req, res) => {
	const itemId = req.params.id;
	const body = req.body;
	body.modificado_por = req.user.username;

	const item = await ItemModel.findById(itemId);
	if (!item) {
		throw docNotFoundErr;
	}

	await updateItem(item, body, res);
};

async function checkNewItemInput (input) {
	const categoriaId = input.categoria;
	const categoria = await categoriaModel.findById(categoriaId);
	if (!categoria) {
		invalidInputErr.message = messages.ITEM_CAT_NOT_FOUND;
		throw invalidInputErr;
	}

	if (input.padre) {
		const padre = await ItemModel.findById(input.padre);
		if (!padre) {
			invalidInputErr.message = messages.ITEM_PADRE_NOT_FOUND;
			throw invalidInputErr;
		}
	}
}

async function updateItem (item, body, res) {
	item.nombre = body.nombre || item.nombre;
	item.descripcion = body.descripcion || item.descripcion;
	item.precio = body.precio || item.precio;
	item.imagen = body.imagen || item.imagen;
	item.guiso = body.guiso || item.guiso;
	item.categoria = body.categoria || item.categoria;
	item.modificado_por = body.modificado_por;
	item.existencias = body.existencias || item.existencias;
	item.padre = body.padre || item.padre;
	item.factor = body.factor || item.factor;
	body.fecha_modificado = new Date;

	const updatedItem = await item.save();
	res.status(statusCodes.OK).send(updatedItem);
}

module.exports = services;
