// Imports
const mongoose = require('mongoose');

// Product schema
const ProductSchema = new mongoose.Schema({
	name:{
		type:String,
		required:[true, 'Product name must be provided']
	},
	price:{
		type:Number,
		required:[true, 'Product price must be provided']
	},
	featured:{
		type:Boolean,
		default:false
	},
	rating:{
		type:Number,
		default:4.5
	},
	createdAt:{
		type:Date,
		default:Date.now(),
	},
	company:{
		type:String,
		// Options, because companies are pre-defined : ikea, liddy...
		enum:{
			values:['ikea','liddy','caressa','marcos'],
			// In the case where user submit => Conforama ;-)
			message:'{VALUE} is not supported'
		}
		// Without custom error message
		// enum:['ikea','liddy','caressa','marcos']
	}
});

// Export
module.exports = mongoose.model('Product', ProductSchema);