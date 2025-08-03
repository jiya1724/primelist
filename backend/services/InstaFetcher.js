class InstaFetcher {
  constructor(apiKey) {
    this.apiKey = apiKey;
  }

  async get_user_posts(username) {
    // TODO: Implement real API call
    return [`https://instagram.com/${username}/post1`, `https://instagram.com/${username}/post2`];
  }
}

module.exports = InstaFetcher; 