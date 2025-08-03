class FacebookFetcher {
  constructor(apiKey) {
    this.apiKey = apiKey;
  }

  async fetch_posts_from_profile(profileUrl) {
    // TODO: Implement real API call
    return [
      `${profileUrl}/post1`,
      `${profileUrl}/post2`
    ];
  }
}

module.exports = FacebookFetcher; 