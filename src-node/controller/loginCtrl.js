const jwt = require('jsonwebtoken');

const jwtSecret = require('./../config/jwt-config').jwtSecret;
const User = require('./../model/UserSchema').getModel();
const manageError = require('./../util/manage-error');
const messages = require('./../util/messages');
const statusCodes = require('./../util/status-codes');

const invalidUserErr = {
	message: messages.INCORRECT_LOGIN,
	statusCode: statusCodes.BAD_REQUEST
};

const services = {};

services.authenticate = (req, res) => {
	const username = req.body.username;
	const password = req.body.password;

	console.log('Autenticando');
	console.log(username);

	const searchCriteria = {
		username: username
	}

	User.findOne(searchCriteria, (err, user) => {
		if (err) {
			manageError(err, res);
		} else if (!user) {
			manageError(invalidUserErr, res);
		} else {
			comparePassword(user, password, res);
		}
	});
};

function comparePassword (user, candidate, res) {
	user.comparePassword(candidate, (err, isMatch) => {
		if (err) {
			manageError(err, res);
		} else {
			res.status(statusCodes.OK).send(getLoginBody(user));
		}
	});
};

function getLoginBody (user) {
	const token = jwt.sign(user, jwtSecret, {
		expiresIn: 60*60*2
	});

	return {
		message: messages.CORRECT_LOGIN,
		token: token
	};
};

module.exports = services;
