const User = require('./../model/UserSchema');
const manageError = require('./../util/manage-error');
const messages = require('./../util/messages');
const statusCodes = require('./../util/status-codes');
const checkReqParams = require('./../util/validations').checkReqParams;

const registerReqParams = ['username', 'password'];
const USER_DUPLICATED_CODE = 11000;

const userSavedObj = {
	message: messages.USER_CREATED
};
const userDuplicatedErr = {
	message: messages.USER_DUPLICATED,
	statusCode: statusCodes.CONFLICT
};

const services = {};

services.register = (req, res) => {
	const body = req.body;
	
	console.log('Registrando');
	console.log(body);

	checkReqParams(body, registerReqParams, (err) => {
		if (err) {
			manageError(err, res);
		} else {
			saveUser(body, res);
		}
	});
};

function saveUser (userBody, res) {
	const newUser = new User(userBody);

	newUser.save((err, savedUser) => {
		if (err) {
			manageSaveError(err, res);
		} else {
			res.status(statusCodes.CREATED).send(userSavedObj);
		}
	});
}

function manageSaveError(err, res) {
	if (err.code === USER_DUPLICATED_CODE) {
		manageError(userDuplicatedErr, res);
	} else {
		manageError(err, res);
	}
}

module.exports = services;
