const ItemModel = require('./../model/Item');
const ofertaModel = require('./../model/Oferta');
const comboModel = require('./../model/Combo');
const errorHandler = require('./../util/error-handler');
const messages = require('./../util/messages');
const statusCodes = require('./../util/status-codes');

const newTicketErr = {
	statusCode: statusCodes.BAD_REQUEST,
	message: messages.TICKET_BAD_REQUEST
};

const services = {};

services.generateTicket = (req, res) => {
	const input = req.body;
	input.atendio = req.user.username;
	input.creado_por = req.user.username;
	
	checkNewTicketInput(input, (err) => {
		if (err) {
			return errorHandler.mongooseError(err, res);
		}

		ofertaModel.getOfertasDeHoy((err, ofertas) => {
			if (err) {
				return errorHandler.mongooseError(err, res);
			}

			input.ofertas = ofertas;
			generarTicket(input, res);
		});
	});
	
};

function checkNewTicketInput (input, cb) {
	let totItems = 0;
	if (input.items && input.items.length) {
		totItems += input.items.length;
	}

	if (input.combos && input.combos.length) {
		totItems += input.combos.length;
	}

	if (totItems < 1) {
		cb(newTicketErr);
	} else {
		cb(null);
	}
}

function getItems (input, res) {
	if (input.items && input.items.length) {
		ItemModel.find({ _id: { $in: input.items } }, (err, items) => {
			if (err) {
				return errorHandler.mongooseError(err, res);
			}

			input.items = items;
			getCombos(input, res);
		});
	} else {
		getCombos(input, res);
	}
}

function getCombos (input, res) {
	if (input.combos && input.combos.length) {
		comboModel.find({ _id: { $in: input.combos } }, (err, combos) => {
			if (err) {
				return errorHandler.mongooseError(err, res);
			}

			input.combos = combos;
			generarTicket(input, res);
		});
	} else {
		generarTicket(input, res);
	}
}

function generarTicket (input, res) {
	input.items = formatItems(input.items);
	input.ofertas = formatOfertas(input.ofertas);

	const ticket = {
		total: getTotal(input).toFixed(1),
		items: input.items,
		ofertas: input.ofertas,
		combos: input.comboss
	};

	res.status(201).send(ticket);
}

function formatItems (items) {
	if (!items || !items.length) {
		return;
	}

	let formatedItems = {};
	items.forEach(item => {
		if (!formatedItems[item._id]) {
			formatedItems[item._id] = item;
			formatedItems[item._id].cantidad = 1;
		} else {
			formatedItems[item._id].cantidad = formatedItems[item._id].cantidad + 1;
		}
	});

	return formatedItems;
}

function formatOfertas (ofertas) {
	if (!ofertas || !ofertas.length) {
		return {};
	}

	let obj = {};
	ofertas.forEach(oferta => {
		oferta.items.forEach(itemId => obj[itemId] = oferta);
	});

	return obj;	
}

function getTotal (input) {
	let total = 0;

	total += getTotalFromCombos(input.combos);
}

function getTotalFromCombos (combos) {
	if (combos && combos.length) {
		return combos.reduce((total, combo) => total + combo.precio, 0);
	}

	return 0;
}

function getTotalFromItems (items, ofertas) {
	if (!items) {
		return 0;
	}

	const total = 0;
	for (let itemId in items) {
		if (items.hasOwnProperty(itemId)) {
			let item = items.itemId;
			if (ofertas[itemId]) {
				total += calcularTotalDeOferta(item, ofertas[itemId]);
			} else {
				total += item.cantidad * item.precio
			}
		}
	}

	return total;
}

function calcularTotalDeOferta(item, oferta) {
	const precio = item.precio;
	const cantidad = item.cantidad;
	switch (oferta.tipo) {
		case 'D':
			return (precio * cantidad * (oferta.descuento/100)).toFixed(1);

		case 'X':
			return ((cantidad/)).toFixed(1);

		default:
			return 0;
	}
}

module.exports = services;
