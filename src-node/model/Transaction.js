const mongoose = require('mongoose');

const Item = require('./Item');
const Combo = require('./Combo');
const Oferta = require('./Oferta');

const schema = new mongoose.Schema({
	total: Number,
    items: [Item.schema],
    combos: [Combo.schema],
    ofertas: [Oferta.schema],
    fecha: { type: Date, default: Date.now },
	atendio: String
});

module.exports = mongoose.model('Combo', schema);