const errorHandler = require('./../util/error-handler');

module.exports = (err, req, res, next) => {
	errorHandler.manageError(err, res);
};
