const messages  = require('./messages');
const statusCodes = require('./status-codes');

const MONG_KEY_DUPLICATED_CODE = 11000;
const MONG_VALIDATION_ERROR = 'ValidationError';
const MONG_CAST_ERROR = 'CastError';
const MONG_ID_FIELD = '_id';

const keyDuplicatedErr = {
	message: messages.MONG_DUPLICATED_KEY,
	statusCode: statusCodes.CONFLICT
};
const validationErr = {
	message: messages.MONG_VALID_ERROR,
	statusCode: statusCodes.BAD_REQUEST
};
const docNotFoundErr = {
	message: messages.MONG_DOC_NOT_FOUND,
	statusCode: statusCodes.NOT_FOUND
};
const castErr = {
	message: messages.MONG_CAST_ERR,
	statusCode: statusCodes.CONFLICT
};

const handlers = {};

handlers.manageError = (err, res) => {
	if (err.code === MONG_KEY_DUPLICATED_CODE) {
		manageKeyDuplicatedError(err, res);
	} else if (err.name === MONG_VALIDATION_ERROR) {
		manageMongValidError(err, res);
	} else if (err.name === MONG_CAST_ERROR) {
		manageCastValidError(err, res);
	} else {
		handlers.generalError(err, res);
	}
};

handlers.mongooseError = (err, res) => {
	if (err.code === MONG_KEY_DUPLICATED_CODE) {
		manageKeyDuplicatedError(err, res);
	} else if (err.name === MONG_VALIDATION_ERROR) {
		manageMongValidError(err, res);
	} else if (err.name === MONG_CAST_ERROR) {
		manageCastValidError(err, res);
	} else {
		handlers.generalError(err, res);
	}
};

handlers.generalError = (err, res) => {
	console.log('Error');
	console.log(err);
	
	let status = statusCodes.INTERNAL_SERVER_ERROR;
	let resBody = {
		message: messages.INTERNAL_ERROR,
	};

	if (err) {
		resBody.err = err;
		resBody.message = err.message || messages.INTERNAL_ERROR;
		status = err.statusCode || status;
	}

	res.status(status).send(resBody);
};

function manageKeyDuplicatedError (err, res) {
	keyDuplicatedErr.mongooseMsg = err.errmsg;
	handlers.generalError(keyDuplicatedErr, res);
}

function manageMongValidError (err, res) {
	validationErr.mongooseMsg = err.message;
	handlers.generalError(validationErr, res);
}

function manageCastValidError (err, res) {
	castErr.campo = err.path
	castErr.mongooseMsg = err.message;
	handlers.generalError(castErr, res);
}

module.exports = handlers;
