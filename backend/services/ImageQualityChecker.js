class ImageQualityChecker {
  constructor(imageFiles) {
    this.imageFiles = imageFiles;
  }

  async start() {
    // TODO: Implement real image quality checking
    // For now, return the input images as 'quality' images
    return this.imageFiles;
  }
}

module.exports = ImageQualityChecker; 