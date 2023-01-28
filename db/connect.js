// Imports
const mongoose = require('mongoose');

// Connect to DB
const connectDB = (url) => {
	// Return a promise !
	return mongoose.connect(url, {
		// Deprecation warning
		useNewUrlParser:true,
		useCreateIndex:true,
		useFindAndModify:false,
		useUnifiedTopology:true
	});
};

// Export
module.exports = connectDB;