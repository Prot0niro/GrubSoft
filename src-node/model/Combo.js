const mongoose = require('mongoose');

const Item = require('./Item');

const schema = new mongoose.Schema({
	nombre: { type: String, required: true, index: { unique: true } },
	descripcion: { type: String, required: true },
	precio: Number,
    items: [Item.schema],
	imagen: String
});

module.exports = mongoose.model('Combo', schema);
