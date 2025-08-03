const express = require('express');
const router = express.Router();
const clerkAuth = require('../middleware/clerkAuth');
const VideoFrameExtractor = require('../services/VideoFrameExtractor');
const ImageQualityChecker = require('../services/ImageQualityChecker');
const Social2Amazon = require('../services/Social2Amazon');
const ProductListings = require('../models/ProductListings');
const ConnectedSocialMedia = require('../models/ConnectedSocialMedia');
const crypto = require('crypto');

// POST convert video to images
router.post('/video-to-images', clerkAuth, async (req, res) => {
    try {
        const { video_url } = req.body;
        if (!video_url) {
            return res.status(400).json({ message: "Video URL required" });
        }

        const extractor = new VideoFrameExtractor(video_url);
        const frameFiles = await extractor.extract_frames();
        
        const qualityChecker = new ImageQualityChecker(frameFiles);
        const qualityImages = await qualityChecker.start();
        
        res.json({
            message: "Conversion successful",
            quality_images: qualityImages
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST process social media to Amazon
router.post('/social2amazon', clerkAuth, async (req, res) => {
    try {
        const { post_link, image_url, description } = req.body;
        if (!post_link) {
            return res.status(400).json({ message: "Post link required" });
        }

        const socialMedia = await ConnectedSocialMedia.findOne();
        if (!socialMedia) {
            return res.status(400).json({ message: "Social media not connected" });
        }

        const processor = new Social2Amazon(process.env.GOOGLE_API_KEY);
        const productData = await processor.process_post({
            post_link,
            image_url,
            description
        });

        // Generate consistent hash
        const productId = crypto.createHash('sha256')
            .update(productData.product_title)
            .digest('hex');

        // Delete existing if found
        await ProductListings.deleteOne({ product_id: productId });

        // Create new listing
        await ProductListings.create({
            product_id: productId,
            images_list: productData.images_list,
            product_title: productData.product_title,
            price: productData.price,
            product_details: productData.product_details,
            about_this_item: productData.about_this_item,
            product_description: productData.product_description
        });

        res.json({ message: "Data added successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;