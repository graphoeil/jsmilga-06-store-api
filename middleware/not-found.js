// 404 !
const notFound = (req, res) => {
	return res.status(404).send('<h1>404 ! Route does not exist</h1>');
};

// Export
module.exports = notFound;