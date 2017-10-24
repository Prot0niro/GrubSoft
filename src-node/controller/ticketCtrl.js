const ItemModel = require('./../model/Item');
const ofertaModel = require('./../model/Oferta');
const comboModel = require('./../model/Combo');
const errorHandler = require('./../util/error-handler');
const messages = require('./../util/messages');
const statusCodes = require('./../util/status-codes');

const docNotFoundErr = require('./../util/common-errors').docNotFoundErr;
const newTicketErr = {
	statusCode: statusCodes.BAD_REQUEST,
	message: messages.TICKET_BAD_REQUEST
};
const noExistenciasErr = {
	statusCode: statusCodes.CONFLICT,
	message: messages.ITEM_EXISTENCIAS_AGOTADO
}

const services = {};

services.nuevaCompra = async (req, res) => {
	const input = req.body;

	checkNuevaCompraInput(input);
	await obtenerItemsCombosYOfertas(input);

	const ticket = {
		total: getTotal(input),
		items: input.items,
		combos: input.combos,
		ofertas: input.ofertas,
		atendio: req.user.username,
		creado_por: req.user.username
	};

	res.status(201).send(ticket);
};

function checkNuevaCompraInput(input) {
	let totalItems = 0;
	if (input.itemsIds) {
		totalItems += input.itemsIds.length;
	}

	if (input.combosIds) {
		totalItems += input.combosIds.length;
	}

	if (totalItems < 1) {
		throw newTicketErr;
	}
}

async function obtenerItemsCombosYOfertas (input) {
	input.items = {};
	input.combos = {};
	input.ofertas = {};
	await obtenerItems(input);
	await obtenerCombosYRestarExistencias(input);
	await restarExistenciasAItemsPadre(input.items);
	await obtenerOfertas(input);
}

async function obtenerItems (input) {
	const itemsIds = input.itemsIds;
	if (!itemsIds || !itemsIds.length) {
		return;
	}

	const items = input.items;
	for (var i = 0; i < itemsIds.length; i++) {
		let itemId = itemsIds[i];
		if (!items[itemId]) {
			items[itemId] = await ItemModel.findById(itemId);
			if (!items[itemId]) throw docNotFoundErr;
			items[itemId].carrito = 1;
		} else {
			items[itemId].carrito++;
		}

		items[itemId].existencias--;
		checkExistencias(items[itemId]);
	}
}

async function obtenerCombosYRestarExistencias (input) {
	const combosIds = input.combosIds;
	if (!combosIds || !combosIds.length) {
		return;
	}

	const combos = input.combos;
	const items = input.items;

	for (let i = 0; i < combosIds.length; i++) {
		let comboId = combosIds[i];
		if (!combos[comboId]) {
			combos[comboId] = await comboModel.findById(comboId);
			if (!combos[comboId]) throw docNotFoundErr;
			combos[comboId].carrito = 1;
		} else {
			combos[comboId].carrito++;
		}

		await restarExistenciasAItemsDeCombo(combos[comboId].items, items);
	}
}

async function restarExistenciasAItemsDeCombo (comboItems, items) {
	for (let j = 0; j < comboItems.length; j++) {
		let itemId = comboItems[j];
		if (!items[itemId]) {
			items[itemId] =  await ItemModel.findById(itemId);
			if (!items[itemId]) throw docNotFoundErr;
		}

		items[itemId].existencias--;
		checkExistencias(items[itemId]);
	}
}

async function restarExistenciasAItemsPadre (items) {
	for (let itemId in items) {
		if (items.hasOwnProperty(itemId)) {
			let item = items[itemId];
			if (item.padre) {
				if (!items[item.padre]) {
					items[item.padre] = await ItemModel.findById(item.padre);
					if (!items[item.padre]) throw docNotFoundErr;
				}

				items[item.padre].existencias -= item.carrito * item.factor;
				checkExistencias(items[item.padre]);
			}
		}
	}
}

async function obtenerOfertas (input) {
	const ofertasArr = await ofertaModel.getOfertasDeHoy();
	const ofertas = input.ofertas;
	for (let i = 0; i < ofertasArr.length; i++) {
		let oferta = ofertasArr[i];
		let ofertaItems = oferta.items;
		for (let j = 0; j < ofertaItems.length; j++) {
			let itemId = ofertaItems[j];
			ofertas[itemId] = oferta;
		}
	}
}

function checkExistencias (item) {
	if (item.existencias < 0) {
		noExistenciasErr.itemId = item._id;
		throw noExistenciasErr;
	}
}

function getTotal (input) {
	let total = 0;

	total += getTotalFromCombos(input.combos);
	console.log(total);
	total += getTotalFromItems(input.items, input.ofertas);
	console.log(total);

	return monetizar(total);
}

function getTotalFromCombos (combos) {
	let total = 0;
	for (let comboId in combos) {
		if (combos.hasOwnProperty(comboId)) {
			let combo = combos[comboId];
			total += combo.precio * combo.carrito;
		}
	}

	return total;
}

function getTotalFromItems (items, ofertas) {
	let total = 0;
	for (let itemId in items) {
		if (items.hasOwnProperty(itemId) && items[itemId].carrito) {
			let item = items[itemId];
			if (ofertas[itemId]) {
				total += calcularTotalDeOferta(item, ofertas[itemId]);
			} else {
				total += item.carrito * item.precio
			}
		}
	}

	return total;
}

function calcularTotalDeOferta(item, oferta) {
	const precio = item.precio;
	const cantidad = item.carrito;
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
	let dec = parseInt(('' + num || 0).split('.')[1] || 0);

	if (dec < 40) {
		return Math.floor(num);
	} else if (dec > 60) {
		return Math.ceil(num);
	} else {
		return Math.floor(num) + .5;
	}
}

module.exports = services;
