const multer = require("multer");
const { sendError } = require("../shared/utils/httpResponse");

const storage = multer.memoryStorage();

const uploadLogoMulter = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
  },
}).single("logo");

function uploadLogo(req, res, next) {
  uploadLogoMulter(req, res, (err) => {
    if (!err) {
      return next();
    }

    if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE") {
      return sendError(
        res,
        400,
        "FILE_TOO_LARGE",
        "Uploaded image size must be 2MB or less.",
      );
    }

    return sendError(
      res,
      400,
      "UPLOAD_ERROR",
      "Invalid logo upload payload. Please try a supported image file.",
    );
  });
}

module.exports = uploadLogo;