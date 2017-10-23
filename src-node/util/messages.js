module.exports = {
	invalidParam: function (name) {
		return 'El parámetro \'' + name + '\' es inválido';
	},
	requiredParam: function (name) {
		return 'El parámetro \'' + name + '\' es necesario';
	},
	CORRECT_LOGIN: 'Login correcto',
	FORBIDDEN_ACCESS: 'Acceso prohibido',
	ITEM_CAT_NOT_FOUND: 'La categoria no existe',
	ITEMS_NOT_FOUND: 'Uno o más items no existen en la base de datos',
	INCORRECT_LOGIN: 'Usuario o contraseña inválidos',
	INTERNAL_ERROR: 'Error interno, contacte al administrador',
	MONG_CAST_ERR: 'Error de casteo, ve mongooseMsg para más detalles',
	MONG_DOC_NOT_FOUND: 'Documento no encontrado',
	MONG_DUPLICATED_KEY: 'Llave duplicada, ve mongooseMsg para más detalles',
	MONG_VALID_ERROR: 'Error de validación de mongoose, ve mongooseMsg para más detalles',
	TICKET_BAD_REQUEST: 'Error en la petición de un nuevo ticket',
	USER_CREATED: 'Usuario creado',
	USER_DUPLICATED: 'Ya existe un usuario con el username preveído',
	UNAUTHORIZED_ACCESS: 'Acceso no autorizado'
};
