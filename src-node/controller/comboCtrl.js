const comboModel = require('./../model/Combo');
const itemModel = require('./../model/Item');
const messages = require('./../util/messages');
const statusCodes = require('./../util/status-codes');

const docNotFoundErr = require('./../util/common-errors').docNotFoundErr;
const itemsNotFoundErr = require('./../util/common-errors').itemsNotFoundErr;
const invalidInputErr = require('./../util/common-errors').invalidInputErr;

const services = {};

services.createDocument = async (req, res) => {
	const doc = req.body;
	doc.creado_por = req.user.username;
	await checkNewComboInput(doc);

	const combo = new comboModel(doc);
	const savedDoc = await combo.save();
	res.status(statusCodes.CREATED).send(savedDoc);
};

services.getDocuments = async (req, res) => {
	const combos = await comboModel.find();
	res.status(statusCodes.OK).send(combos);
};

services.getDocument = async (req, res) => {
	const comboId = req.params.id;
	const combo = await comboModel.findById(comboId);
	if (!combo) {
		throw docNotFoundErr;
	}

	res.status(statusCodes.OK).send(combo);
};

services.deleteDocument = async (req, res) => {
	const comboId = req.params.id;
	const combo = await comboModel.findByIdAndRemove(comboId);
	if (!combo) {
		throw docNotFoundErr;
	}

	res.status(statusCodes.OK).send(combo);
};

services.updateDocument = async (req, res) => {
	const comboId = req.params.id;
	const body = req.body;
	body.modificado_por = req.user.username;
	combo = await comboModel.findById(comboId);
	if (!combo) {
		throw docNotFoundErr;
	}

	await updateDocument(combo, body, res);
};

async function checkNewComboInput (body, cb) {
	if (!body.items || !body.items.length) {
		invalidInputErr.message = messages.requiredParam('items');
		throw invalidInputErr;
	}

	const items = await itemModel.find({ _id: { $in: body.items } });
	if (!items || !items.length) {
		throw itemsNotFoundErr;
	}
}

async function updateDocument (combo, body, res) {
	combo.nombre = body.nombre || combo.nombre;
	combo.descripcion = body.descripcion || combo.descripcion;
	combo.precio = body.precio || combo.precio;
	combo.imagen = body.imagen || combo.imagen;
	combo.items = body.items || combo.items;
	combo.modificado_por = body.modificado_por;
	combo.fecha_modificado = new Date;

	const updatedCombo = await combo.save();
	res.status(statusCodes.OK).send(updatedCombo);
}

module.exports = services;
