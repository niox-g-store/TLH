const sharp = require('sharp');
const { encode } = require('blurhash');

exports.encodeImageToBlurhash = async (imagePath) => {
  try {
    const { data, info } = await sharp(imagePath)
      .resize(128, 128, { fit: 'inside' })
      .raw()
      .toBuffer({ resolveWithObject: true });

    if (info.channels !== 4) {
        const { data: rgbaData, info: rgbaInfo } = await sharp(imagePath)
            .resize(128, 128, { fit: 'inside' })
            .ensureAlpha()
            .raw()
            .toBuffer({ resolveWithObject: true });

        const pixels = new Uint8ClampedArray(rgbaData);
        return encode(pixels, rgbaInfo.width, rgbaInfo.height, 4, 4);
    }

    const pixels = new Uint8ClampedArray(data);

    return encode(pixels, info.width, info.height, 4, 4);

  } catch (error) {
    return null;
  }
};