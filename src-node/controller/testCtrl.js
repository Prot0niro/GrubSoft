const services = {};

services.test = (req, res) => {
	res.status(200).send(req.user);
};

module.exports = services;
