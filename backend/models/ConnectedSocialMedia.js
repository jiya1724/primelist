const mongoose = require('mongoose');

const ConnectedSocialMediaSchema = new mongoose.Schema({
  instagram_link: {
        type: String,
        maxlength: 100
    },
    facebook_link: {
        type: String,
        maxlength: 100
    },
    tiktok_link: {
        type: String,
        maxlength: 100
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('ConnectedSocialMedia', ConnectedSocialMediaSchema);
