const mongoose = require('mongoose');

const schema = new mongoose.Schema({
	nombre: { type: String, required: true, index: { unique: true } },
	descripcion: { type: String, required: true },
	precio: Number,
    cantidad: Number,
	imagen: String
});

module.exports = mongoose.model('Item', schema);
