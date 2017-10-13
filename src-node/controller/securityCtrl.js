const jwt = require('jsonwebtoken');

const jwtSecret = require('./../config/jwt-config').secret;
const manageError = require('./../util/error-handler').generalError;
const messages = require('./../util/messages');
const statusCodes = require('./../util/status-codes');

const securityErr = {
	message: messages.UNAUTHORIZED_ACCESS,
	statusCode: statusCodes.UNAUTHORIZED
};

const services = {};

services.ensureAuthenticated = (req, res, next) => {
	const token =  req.headers['x-access-token'] || req.body.token || req.query.token;

	if (token) {
		jwt.verify(token, jwtSecret, function(err, decoded) {
			if (err) {
				manageError(securityErr, res);
				return;
			}

			req.user = decoded;
			next();
		});
	} else {
		manageError(securityErr, res);
	}
};

module.exports = services;
