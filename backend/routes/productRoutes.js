import express from 'express';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';
import Product from '../models/Product.js';

const router = express.Router();

const normalizeImageList = (value) => {
  const normalizeImageValue = (item) => {
    if (!item) return null;
    if (typeof item === 'string') return item.trim() || null;
    if (typeof item === 'object') {
      return item.url || item.imageUrl || item.secure_url || null;
    }
    return String(item);
  };

  if (Array.isArray(value)) {
    return value.map(normalizeImageValue).filter(Boolean);
  }

  if (typeof value === 'string' && value.trim()) {
    return [value.trim()];
  }

  return [];
};

router.get('/', async (req, res) => {
  const products = await Product.find({});
  res.json(products);
});

router.get('/:slug', async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug });
  if (product) res.json(product);
  else res.status(404).json({ message: 'Product not found' });
});

router.post('/', protect, authorizeRoles('super_admin', 'admin'), async (req, res) => {
  const images = normalizeImageList(req.body.images || req.body.imageUrls || req.body.imageUrl);
  const productPayload = {
    ...req.body,
    images,
  };

  const product = new Product(productPayload);
  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

router.put('/:id', protect, authorizeRoles('super_admin', 'admin'), async (req, res) => {
  const incomingImages = normalizeImageList(req.body.images || req.body.imageUrls || req.body.imageUrl);
  const productPayload = {
    ...req.body,
  };

  if (incomingImages.length > 0) {
    productPayload.images = incomingImages;
  } else {
    delete productPayload.images;
  }

  const product = await Product.findByIdAndUpdate(req.params.id, productPayload, { new: true });
  if (product) res.json(product);
  else res.status(404).json({ message: 'Product not found' });
});

router.delete('/:id', protect, authorizeRoles('super_admin', 'admin'), async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (product) res.json({ message: 'Product removed' });
  else res.status(404).json({ message: 'Product not found' });
});

export default router;
