const mongoose = require('mongoose');

const schema = new mongoose.Schema({
	total: { type: Number, required: true },
	items: [mongoose.Schema.Types.Mixed],
	combos: [mongoose.Schema.Types.Mixed],
	ofertas: [mongoose.Schema.Types.Mixed],
	fecha: { type: Date, default: Date.now },
	atendio: String,
	fecha_creado: { type: Date, default: Date.now },
	fecha_modificado: { type: Date, default: Date.now },
	creado_por: String,
	modificado_por: String
});

module.exports = mongoose.model('Ticket', schema);
