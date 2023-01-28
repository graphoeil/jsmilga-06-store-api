// .env
require('dotenv').config();

// Mongoose and db connection
const connectDB = require('./db/connect');

// Product model
const Product = require('./models/product');

// JSON products
const jsonProducts = require('./products.json');

// Auto populate mongoDB with data from products.json
const start = async() => {
	try {
		await connectDB(process.env.MONGO_URI);
		// Remove all products from db
		await Product.deleteMany();
		// Add all products from json
		await Product.create(jsonProducts);
		// Success confirmation
		console.log('Populate DB successfull !');
		// Exit
		process.exit(0);
	} catch (error){
		console.log(error);
		// Exit with error code
		process.exit(1);
	}
};

// Init => we start this file with node populate.js (not npm start => nodemon)
start();