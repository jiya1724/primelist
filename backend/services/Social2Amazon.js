class Social2Amazon {
  constructor(apiKey) {
    this.apiKey = apiKey;
  }

  async process_post({ post_link, image_url, description }) {
    // TODO: Implement real conversion logic
    return {
      images_list: [image_url],
      product_title: 'Sample Product',
      price: '19.99',
      product_details: { color: 'red', size: 'M' },
      about_this_item: 'Sample about this item',
      product_description: description || 'Sample product description',
    };
  }
}

module.exports = Social2Amazon; 