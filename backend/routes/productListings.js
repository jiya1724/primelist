const express = require('express');
const router = express.Router();
const ProductListings = require('../models/ProductListings');
const clerkAuth = require('../middleware/clerkAuth');

// GET recent product
router.get('/', clerkAuth, async (req, res) => {
    try {
        const product = await ProductListings.findOne().sort({ created_at: -1 });
        if (!product) {
            return res.status(404).json({ message: "No products found" });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// UPDATE product listing
router.post('/update', clerkAuth, async (req, res) => {
    try {
        const { product_id, ...updateData } = req.body;
        const product = await ProductListings.findOne({ product_id });

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        Object.assign(product, updateData);
        await product.save();
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET previous listings
router.get('/previous', clerkAuth, async (req, res) => {
    try {
        const products = await ProductListings.find()
            .sort({ created_at: -1 })
            .skip(1);
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;