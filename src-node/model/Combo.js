const mongoose = require('mongoose');

const schema = new mongoose.Schema({
	nombre: { type: String, required: true, index: { unique: true } },
	descripcion: { type: String, required: true },
	precio: { type: Number, required: true, min: 0 },
	items: { type: [String], 	required: true },
	imagen: String,
	fecha_creado: { type: Date, default: Date.now },
	fecha_modificado: { type: Date, default: Date.now },
	creado_por: String,
	modificado_por: String
});

module.exports = mongoose.model('Combo', schema);
