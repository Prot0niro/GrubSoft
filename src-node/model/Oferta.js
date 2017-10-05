const mongoose = require('mongoose');

const schema = new mongoose.Schema({
	nombre: { type: String, required: true, index: { unique: true } },
	descripcion: { type: String, required: true },
	precio: Number,
    items: [String],
	imagen: String,
	fecha_inicio: Date,
	fecha_fin: Date,
	dias: [Number],
	tipo: String,
	descuento: Number,
	x_por_y_x: Number,
	x_por_y_y: Number,
    fecha_creado: { type: Date, default: Date.now },
    fecha_modificado: { type: Date, default: Date.now },
    creado_por: String,
    modificado_por: String
});

module.exports = mongoose.model('Combo', schema);
