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
			getItems(input, res);
		});
	});
	
};

function checkNewTicketInput (input, cb) {
	let totItems = 0;
	if (input.itemsIds && input.itemsIds.length) {
		totItems += input.itemsIds.length;
	}

	if (input.combosIds && input.combosIds.length) {
		totItems += input.combosIds.length;
	}

	if (totItems < 1) {
		cb(newTicketErr);
	} else {
		cb(null);
	}
}

function getItems (input, res) {
	if (input.itemsIds && input.itemsIds.length) {
		ItemModel.find({ _id: { $in: input.itemsIds } }, (err, items) => {
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
	if (input.combosIds && input.combosIds.length) {
		comboModel.find({ _id: { $in: input.combosIds } }, (err, combos) => {
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
	input.itemsIds = formatItemsIds(input.itemsIds);
	input.items = formatItems(input.items, input.itemsIds);
	input.combosIds = formatCombosIds(input.combosIds);
	input.combos = formatCombos(input.combos, input.combosIds);
	input.ofertas = formatOfertas(input.ofertas);

	const ticket = {
		total: getTotal(input),
		items: input.items,
		combos: input.combos,
		ofertas: input.ofertas
	};

	res.status(201).send(ticket);
}

function formatItemsIds (itemsIds) {
	if (!itemsIds || !itemsIds.length) {
		return;
	}

	let formatedItemsIds = {};
	itemsIds.forEach(itemId => {
		if (!formatedItemsIds[itemId]) {
			formatedItemsIds[itemId] = {};
			formatedItemsIds[itemId]._id = itemId;
			formatedItemsIds[itemId].cantidad = 1;
		} else {
			formatedItemsIds[itemId].cantidad++;
		}
	});

	return formatedItemsIds;
}

function formatItems (items, itemsIds) {
	if (!items || !items.length) {
		return;
	}

	let formatedItems = {};
	items.forEach(item => {
		item.cantidad = itemsIds[item._id].cantidad;
		formatedItems[item._id] = item;
	});

	return formatedItems;
}

function formatCombosIds (ids) {
	if (!ids || !ids.length) {
		return;
	}

	let formatedIds = {};
	ids.forEach(id => {
		if (!formatedIds[id]) {
			formatedIds[id] = {};
			formatedIds[id]._id = id;
			formatedIds[id].cantidad = 1;
		} else {
			formatedIds[id].cantidad++;
		}
	});

	return formatedIds;
}

function formatCombos (combos, ids) {
	if (!combos || !combos.length) {
		return;
	}

	let formatedCombos = {};
	combos.forEach(combo => {
		combo.cantidad = ids[combo._id].cantidad;
		formatedCombos[combo._id] = combo;
	});

	return formatedCombos;
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
	total += getTotalFromItems(input.items, input.ofertas);

	return monetizar(total);
}

function getTotalFromCombos (combos) {
	if (!combos) {
		return 0;
	}

	let total = 0;
	for (let comboId in combos) {
		if (combos.hasOwnProperty(comboId)) {
			let combo = combos[comboId];
			total += combo.precio * combo.cantidad;
		}
	}

	return total;
}

function getTotalFromItems (items, ofertas) {
	if (!items) {
		return 0;
	}

	let total = 0;
	for (let itemId in items) {
		if (items.hasOwnProperty(itemId)) {
			let item = items[itemId];
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
	const x = oferta.x_por_y_x;
	const y = oferta.x_por_y_y;

	switch (oferta.tipo) {
		case 'D':
			return (precio * cantidad * (oferta.descuento/100));

		case 'X':
			return (Math.floor(cantidad/x) * y * precio + cantidad%x * precio);

		default:
			return 0;
	}
}

function monetizar (num) {
	let dec = parseInt(('' + num).split('.')[1] || 0);

	if (dec < 40) {
		return Math.floor(num);
	} else if (dec > 60) {
		return Math.ceil(num);
	} else {
		return Math.floor(num) + .5;
	}
}

module.exports = services;
