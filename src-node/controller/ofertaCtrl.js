const ofertaModel = require('./../model/Oferta');
const itemModel = require('./../model/Item');
const messages = require('./../util/messages');
const statusCodes = require('./../util/status-codes');

const docNotFoundErr = require('./../util/common-errors').docNotFoundErr;
const invalidInputErr = require('./../util/common-errors').invalidInputErr;

const services = {};

services.createDocument = async (req, res) => {
	const input = req.body;
	input.creado_por = req.user.username;
	await checkNewOfertaInput(input);

	const oferta = new ofertaModel(input);
	const savedDoc = await oferta.save();
	res.status(statusCodes.CREATED).send(savedDoc);
};

services.getDocuments = async (req, res) => {
	const ofertas = await ofertaModel.find();
	res.status(statusCodes.OK).send(ofertas);
};

services.getDocument = async (req, res) => {
	const ofertaId = req.params.id;
	const oferta = await ofertaModel.findById(ofertaId);
	if (!oferta) {
		throw docNotFoundErr;
	}

	res.status(statusCodes.OK).send(oferta);
};

services.deleteDocument = async (req, res) => {
	const ofertaId = req.params.id;
	const oferta = await ofertaModel.findByIdAndRemove(ofertaId);
	if (!oferta) {
		throw docNotFoundErr;
	}

	res.status(statusCodes.OK).send(oferta);
};

services.updateDocument = async (req, res) => {
	const ofertaId = req.params.id;
	const body = req.body;
	body.modificado_por = req.user.username;

	const oferta = await ofertaModel.findById(ofertaId);
	if (!oferta) {
		throw docNotFoundErr;
	}

	await updateDocument(oferta, body, res);
};

services.getOfertasDeHoy = async (req, res) => {
	const ofertas = await ofertaModel.getOfertasDeHoy();
	res.status(statusCodes.OK).send(ofertas);
};

async function checkNewOfertaInput (input) {
	if (!input.items || !input.items.length) {
		invalidInputErr.message = messages.requiredParam('items');
		throw invalidInputErr;
	}

	const items = await itemModel.find({ _id: { $in: input.items } });
	if (!items || input.items.length !== items.length) {
		invalidInputErr.message = messages.ITEMS_NOT_FOUND;
		throw invalidInputErr;
	}
}

async function updateDocument (oferta, body, res) {
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

	const updatedOferta = await oferta.save();
	res.status(statusCodes.OK).send(updatedOferta);
}

module.exports = services;
