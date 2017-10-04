const jwt = require('jsonwebtoken');

const jwtSecret = require('./../config/jwt-config').secret;
const manageError = require('./../util/manage-error');
const messages = require('./../util/messages');
const statusCodes = require('./../util/status-codes');

const securityErr = {
	message: messages.FORBIDDEN_ACCESS,
	statusCode: statusCodes.FORBIDDEN
};

const services = {};

services.ensureAuthenticated = (req, res, next) => {
	const token = req.body.token || req.query.token || req.headers['x-access-token'];

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
