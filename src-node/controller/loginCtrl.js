const jwt = require('jsonwebtoken');

const jwtSecret = require('./../config/jwt-config').secret;
const User = require('./../model/UserSchema');
const manageError = require('./../util/manage-error');
const messages = require('./../util/messages');
const statusCodes = require('./../util/status-codes');

const TOKEN_EXPIRE = '3h';
const invalidUserErr = {
	message: messages.INCORRECT_LOGIN,
	statusCode: statusCodes.BAD_REQUEST
};
const jwtOptions = {
	expiresIn: TOKEN_EXPIRE
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

	User.findOne(searchCriteria, (err, mongooseUser) => {
		if (err) {
			manageError(err, res);
		} else if (!mongooseUser) {
			manageError(invalidUserErr, res);
		} else {
			comparePassword(mongooseUser, password, res);
		}
	});
};

function comparePassword (mongooseUser, candidate, res) {
	mongooseUser.comparePassword(candidate, (err, isMatch) => {
		if (err) {
			manageError(err, res);
		} else {
			const userObject = createUserObject(mongooseUser);
			createToken(userObject, res);
		}
	});
};

function createUserObject (mongooseUser) {
	return {
		username: mongooseUser.username,
		name: mongooseUser.name,
		admin: mongooseUser.admin
	};
}

function createToken (user, res) {
	console.log(typeof user);
	jwt.sign(user, jwtSecret, jwtOptions, (err, token) => {
		if (err) {
			manageError(err, res);
		} else {
			res.status(statusCodes.OK).send({
				message: messages.CORRECT_LOGIN,
				token: token
			});
		}
	});
};

module.exports = services;
