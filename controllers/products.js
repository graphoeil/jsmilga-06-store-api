// Product model
const { query } = require("express");
const Product = require('../models/product');

// Mongoose v6
// With v5 mongoose return an empty array if we search a property that is not in the schema
// With v6 mongoose ignore property that is not in the schema and only return property match to schema !!!
// await Product.find({ notInSchema:1 }).setOptions({ strict:false }); - v5
// became in v6 => await Product.find({ notInSchema:1 }, null, { strict:false });
// http://localhost:3000/api/v1/products?page=3&featured=true
/* => will return json with empty array because v5 here 
{
	"nbHits": 0,
	"products": []
} 
!!! With v6 it'll return products who are featured ;-) */

// Get all products
//
// Dynamic approach => query params
const getAllProducts = async(req, res) => {
	// It's a better and safer way to pass property we want find
	const { name, featured, company, sort, fields, numericFilters } = req.query;
	// Filters
	const queryObject = {};
	if (featured){
		// Add new property to queryObject
		queryObject.featured = featured === 'true' ? true : false;
	}
	if (company){
		queryObject.company = company;
	}
	if (name){
		// https://www.mongodb.com/docs/manual/reference/operator/query/
		// https://www.mongodb.com/docs/manual/reference/operator/query/regex/#mongodb-query-op.-regex
		queryObject.name = { $regex:name, $options:'i' };
	}
	if (numericFilters){
		const operatorMap = {
			'>':'$gt',
			'>=':'$gte',
			'=':'$e',
			'<':'$lt',
			'<=':'$lte'
		};
		// Regex, converting > to $gt ...
		const regex = /\b(>|>=|=|<|<=)\b/g;
		let filters = numericFilters.replace(regex, (match) => {
			// price>40,rating>=4 became price-$gt-40,rating-$gte-4
			return `-${ operatorMap[match] }-`;
		});
		const options = ['price', 'rating'];
		filters = filters.split(',').forEach((item) => {
			// price-$gt-40 => price, $gt, 40 ;-)
			const [field, operator, value] = item.split('-');
			// Only if the field is in our options
			if (options.includes(field)){
				queryObject[field] = { [operator]:Number(value) };
			}
		});
	}
	console.log(queryObject); // { price: { '$gt': 40 }, rating: { '$gte': 4 } }
	// Results
	let result = Product.find(queryObject);
	// Sort
	if (sort){
		// Removing , from request => http://localhost:3000/api/v1/products?sort=name,-price
		const sortList = sort.split(',').join(' ');
		result = result.sort(sortList);
	} else {
		// Default sort
		result = result.sort('createdAt');
	}
	// Fields to select which property we want to return
	// http://localhost:3000/api/v1/products?fields=name,price
	if (fields){
		const fieldsList = fields.split(',').join(' ');
		result.select(fieldsList);
	}
	// Limit and Skip (perfect for pagination...)
	const page = Number(req.query.page) || 1;
	const limit = Number(req.query.limit) || 10;
	const skip = (page - 1) * limit; // 1 - 1 = 0, 0 * 10 = 0, so we don't skip anything, etc...
	result = result.skip(skip).limit(limit);
	// Products
	const products = await result;
	// Response
	res.status(200).json({
		nbHits:products.length,
		products
	});
};
// DEV - Ikea => http://localhost:3000/api/v1/products/ikea
const getAllIkeaProducts = async(req, res) => {
	const { featured } = req.query;
	const queryObject = { company:'ikea' };
	if (featured){
		queryObject.featured = featured === 'true' ? true : false;
	}
	// Sort by price (decreasing) and name
	const ikeaProducts = await Product.find(queryObject).sort('-price name');
	res.status(200).json({
		nbHits:ikeaProducts.length,
		ikeaProducts
	});
};
// DEV - Liddy => http://localhost:3000/api/v1/products/liddy
const getAllLiddyProducts = async(req, res) => {
	const liddyProducts = await Product.find({ company:'liddy' });
	res.status(200).json({
		nbHits:liddyProducts.length,
		liddyProducts
	});
};
//
// Static approach => hard coded
const getAllProductsStatic = async(req, res) => {
	// Here we use "express-async-errors": "^3.1.1"
	// It's use our error-handler (middleware)
	// It's replace try / catch block by just throwing an error ;-)
	// throw new Error('Testing error with express-async-errors package !');
	//
	// Find products
	// .find({}) => to get all products
	const products = await Product.find({ price:{ $gt:30 } })
		.sort('price')
		.select('name price')
		.limit(10)
		.skip(1);
	// Response
	res.status(200).json({
		nbHits:products.length,
		products
	});
};

// Create product
const createProduct = async(req, res) => {
	const newProduct = await Product.create(req.body);
	res.status(200).json({
		product:newProduct
	});
};

// Exports
module.exports = { getAllProducts, getAllIkeaProducts, getAllLiddyProducts, getAllProductsStatic, createProduct };