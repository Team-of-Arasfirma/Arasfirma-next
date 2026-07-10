import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  images: [{ // SAVES CLOUDINARY URL TO MONGODB
    type: String, // SAVES CLOUDINARY URL TO MONGODB
  }],
  features: [{
    type: String, // Array of features
  }],
  inStock: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

export default Product;
