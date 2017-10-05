const mongoose = require('mongoose');

const messages = require('./../util/messages');
const statusCodes = require('./../util/status-codes');

const itemNotFoundErr = {
	statusCode: statusCodes.BAD_REQUEST,
	message: messages.ITEMS_NOT_FOUND
};

const schema = new mongoose.Schema({
	nombre: { type: String, required: true, index: { unique: true } },
	descripcion: { type: String, required: true },
	precio: { type: Number, required: true },
	imagen: String,
	fecha_creado: { type: Date, default: Date.now },
	fecha_modificado: { type: Date, default: Date.now },
	creado_por: String,
	modificado_por: String
});

schema.statics.checkIfItemsExist = function (ids, cb) {
	this.find({ _id: { $in: ids } }, (err, foundItems) => {
		if (err) {
			return cb(err);
		}

		if (foundItems.length !== ids.length) {
			return cb(itemNotFoundErr);
		}

		cb(null);
	});
};

module.exports = mongoose.model('Item', schema);
