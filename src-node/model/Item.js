const mongoose = require('mongoose');

const messages = require('./../util/messages');
const statusCodes = require('./../util/status-codes');

const itemNotFoundErr = {
	statusCode: statusCodes.BAD_REQUEST,
	message: messages.ITEMS_NOT_FOUND
};

const schema = new mongoose.Schema({
	nombre: { type: String, required: true, index: { unique: true } },
	categoria: { type: String, required: true },
	guiso: Boolean,
	existencias: { type: Number, min: 0, required: true },
	padre: { type: String },
	factor: { type: Number, validate: factorValidacion },
	descripcion: { type: String, required: true },
	precio: { type: Number, required: true },
	imagen: String,
	fecha_creado: { type: Date, default: Date.now },
	fecha_modificado: { type: Date, default: Date.now },
	creado_por: String,
	modificado_por: String
});

function factorValidacion (val) {
	return this.padre ? val > 0 : true;
}

module.exports = mongoose.model('Item', schema);
