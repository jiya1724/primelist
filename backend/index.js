const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const clerkAuth = require('./middleware/clerkAuth');
const authRoutes = require('./routes/auth');
const cors = require('cors');


dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use(clerkAuth);
app.use('/auth', authRoutes);
app.use('/social-media', require('./routes/socialMedia'));
app.use('/products', require('./routes/productListings'));
app.use('/dashboard', require('./routes/dashboard'));
app.use('/profile', require('./routes/profile'));
app.use('/fetch', require('./routes/fetchPosts'));
app.use('/convert', require('./routes/conversion'));
app.use('/posts', require('./routes/posts'));
app.use('/api/facebook', require('./routes/facebookFetcher'));
app.use('/api/gemini', require('./routes/gemini'));
app.use('/api/insta', require('./routes/instaFetcher'));
app.use('/api/insta-processor', require('./routes/instaProcessor'));
app.use('/api/merged-processor', require('./routes/mergedProcessor'));
app.use('/api/profile-data', require('./routes/profile'));
app.use('/api/dashboard-stats', require('./routes/dashboard'));
app.use('/api/products', require('./routes/productListings'));
app.use('/api/previous_listing_data', require('./routes/productListings'));
app.use('/api/connected_social_media', require('./routes/socialMedia'));
app.use('/api/recent_fetched_post', require('./routes/productListings'));
app.use('/api/update_listing_data', require('./routes/productListings'));


mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log(' MongoDB connected');
  app.listen(PORT, () => console.log(` Server running on http://localhost:${PORT}`));
})
.catch((err) => {
  console.error(' MongoDB connection error:', err);
});
