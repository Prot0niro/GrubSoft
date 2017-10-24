const messages = require('./../util/messages');
const statusCodes = require('./../util/status-codes');

const services = {};

services.isUserAdmin = (req, res) => {
	if (req.user.admin) {
		res.status(statusCodes.OK).send({});
	} else {
		res.status(statusCodes.FORBIDDEN).send({ message: messages.FORBIDDEN_ACCESS });
	}
};

module.exports = services;
