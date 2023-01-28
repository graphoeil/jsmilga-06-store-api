// Express
const express = require('express');

// .env
require('dotenv').config();

// Mongoose and db connection
const connectDB = require('./db/connect');

// Async errors
require('express-async-errors');

// App
const app = express();

// JSON parsing
app.use(express.json());

// Routes
// Homepage
app.get('/', (req, res) => {
	res.send(`
		<h1>Store API</h1>
		<a href="/api/v1/products">Products</a>
	`);
});
// Products route
const productsRouter = require('./routes/products');
app.use('/api/v1/products', productsRouter);
// 404
const notFoundMiddleware = require('./middleware/not-found');
app.use(notFoundMiddleware);
// Custom error middleware
const errorMiddleware = require('./middleware/error-handler');
app.use(errorMiddleware);

// Port
const port = process.env.PORT || 3000;

// Start / Listen
const start = async() => {
	try {
		await connectDB(process.env.MONGO_URI);
		app.listen(port, console.log(`Server is listening on port ${ port }...`));
	} catch (error){
		console.log(error);
	}
};

// Init
start();