const services = {};

services.test = (req, res) => {
	res.status(200).send({ message: 'Hola' });
};

module.exports = services;
