const fs = require('fs');
const path = require('path');
const os = require('os');
const { v4: uuidv4 } = require('uuid');

class FileManager {
  constructor() {
    this.baseDir = path.join(os.homedir(), 'file_manager', 'uploads');

    if (!fs.existsSync(this.baseDir)) {
      fs.mkdirSync(this.baseDir, { recursive: true });
    }
  }

  /**
   * Upload image to local storage (limit: 10MB)
   * @param {Buffer} buffer - The image buffer
   * @param {string} originalName - The original file name
   * @returns {string} - The full path of the saved file
   */
  async uploadImage(buffer, originalName) {
    const MAX_SIZE_MB = 10;
    const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

    if (buffer.length > MAX_SIZE_BYTES) {
      throw new Error(`Image exceeds ${MAX_SIZE_MB}MB limit.`);
    }

    const safeName = originalName.replace(/\s+/g, '_');

    // Create unique filename with timestamp prefix
    const uniqueName = `${Date.now()}-${safeName}`;
    const filePath = path.join(this.baseDir, uniqueName);
    await fs.promises.writeFile(filePath, buffer);
    return filePath;
  }

  /**
   * Upload video to local storage (limit: 20MB)
   * @param {Buffer} buffer - The video buffer
   * @param {string} originalName - The original file name
   * @returns {string} - The full path of the saved file
   */
  async uploadVideo(buffer, originalName) {
    const MAX_SIZE_MB = 20;
    const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

    if (buffer.length > MAX_SIZE_BYTES) {
      throw new Error(`Video exceeds ${MAX_SIZE_MB}MB limit.`);
    }

    const uniqueName = `${uuidv4()}-${originalName}`;
    const filePath = path.join(this.baseDir, uniqueName);
    await fs.promises.writeFile(filePath, buffer);
    return filePath;
  }
}

module.exports = FileManager;
