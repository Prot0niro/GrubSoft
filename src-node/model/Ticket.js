const mongoose = require('mongoose');

const Item = require('./Item');
const Combo = require('./Combo');
const Oferta = require('./Oferta');

const schema = new mongoose.Schema({
    total: { type: Number, required: true },
    items: [Item.schema],
    combos: [Combo.schema],
    ofertas: [Oferta.schema],
    fecha: { type: Date, default: Date.now },
	atendio: String,
    fecha_creado: { type: Date, default: Date.now },
    fecha_modificado: { type: Date, default: Date.now },
    creado_por: String,
    modificado_por: String
});

module.exports = mongoose.model('Ticket', schema);
