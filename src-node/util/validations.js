const messages = require('./messages');
const statusCodes = require('./status-codes');

const errorBody = {};

module.exports = {
	checkReqParams: (body, reqParams, cb) => {
		errorBody.statusCode = statusCodes.BAD_REQUEST;

		if (!body) {
			errorBody.message = messages.requiredParam('body');
			cb(errorBody);
			return;
		}

		for (var i = 0; i < reqParams.length; i++) {
			let paramName = reqParams[i];
			if (!body[paramName]) {
				errorBody.message = messages.requiredParam(paramName);
				cb(errorBody);
				return;
			}
		}

		cb(null);
	}
};
