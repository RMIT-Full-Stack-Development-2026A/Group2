const streamifier = require("streamifier");
const cloudinary = require("../../config/cloudinary");

function uploadBufferToCloudinary(fileBuffer, options = {}) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });

    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
}

async function destroyCloudinaryAsset(publicId) {
  if (!publicId) {
    return null;
  }
  return cloudinary.uploader.destroy(publicId, { resource_type: "image" });
}

module.exports = {
  uploadBufferToCloudinary,
  destroyCloudinaryAsset,
};