const mongoose = require('mongoose');

const TIPO_DESCUENTO = 'D';
const TIPO_X_POR_Y = 'X';
const ERROR_TIPO = 'Error de tipo. Asegúrate de tener las variables de \'descuento\' o \'x_por_y_x\' y \'x_por_y_y\' dependiendo del tipo de oferta';

const schema = new mongoose.Schema({
	nombre: 			{ type: String, 	required: true, index: { unique: true } },
	descripcion: 		{ type: String, 	required: true },
	items: 				{ type: [String], 	required: true },
	imagen: 			String,
	dias: 				{ type: [Number], 	required: true, validate: diasValidation },
	tipo: 				{ type: String, 	required: true, validate: { validator: tipoValidation}, message: ERROR_TIPO },
	descuento: 			{ type: Number, 	validate: descuentoValidation },
	x_por_y_x: 			{ type: Number, 	validate: xPorYXValidation },
	x_por_y_y: 			{ type: Number, 	validate: xPorYYValidation },
	fecha_creado: 		{ type: Date, 		default: Date.now },
	fecha_modificado: 	{ type: Date, 		default: Date.now },
	creado_por: 		String,
	modificado_por: 	String
});

schema.statics.getOfertasDeHoy = function (cb) {
	const dia = (new Date).getDay();
	this.find({ dias: dia }, cb);
};

function diasValidation (arr) {
	return arr.every(v => {
		return typeof v === 'number' && v >= 0 && v <=6;
	});
}

function tipoValidation (val) {
	switch (val) {
		case TIPO_DESCUENTO:
			return this.descuento > 0;
		case TIPO_X_POR_Y:
			return this.x_por_y_x > 0
				&& this.x_por_y_y > 0;
		default:
			return false;
	}
}

function descuentoValidation (val) {
	return this.tipo === TIPO_DESCUENTO ? val >= 1 && val <= 100 : true;
}

function xPorYXValidation (val) {
	return	this.tipo === TIPO_X_POR_Y ? val >= 1 && val <= 10 : true;
}

function xPorYYValidation (val) {
	return	this.tipo === TIPO_X_POR_Y ? val >= 1 && val < this.x_por_y_x : true;
}

module.exports = mongoose.model('Oferta', schema);
