const messages = require('./messages');
const statusCodes = require('./status-codes');

module.exports = {
	docNotFoundErr: {
		message: messages.MONG_DOC_NOT_FOUND,
		statusCode: statusCodes.NOT_FOUND
	},
	invalidInputErr: {
		statusCode: statusCodes.BAD_REQUEST
	},
	itemsNotFoundErr: {
		statusCode: statusCodes.BAD_REQUEST,
		message: messages.ITEMS_NOT_FOUND
	}
};
