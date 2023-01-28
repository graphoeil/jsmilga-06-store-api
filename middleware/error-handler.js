// Custom error handler
const errorHandlerMiddleware = async (err, req, res, next) => {
	console.log(err); // This log is in Terminal ;-)
	return res.status(500).json({ msg:err.toString() });
};

// Export
module.exports = errorHandlerMiddleware;