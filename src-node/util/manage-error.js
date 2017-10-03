const messages  = require('./messages');
const statusCodes = require('./status-codes');

module.exports = (err, res) => {
	console.log('Error');
	console.log(err);
	
	let status = statusCodes.INTERNAL_SERVER_ERROR;
	let resBody = {
		message: messages.INTERNAL_ERROR,
	};

	if (err) {
		resBody.message = err.message || resBody.message;
		status = err.statusCode || status;
	}

	res.status(status).send(resBody);
};
