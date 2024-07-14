const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "./uploads"); // Ensure this directory exists
  },
  filename: (req, file, callback) => {
    const filename = `${Date.now()}-${file.originalname}`;
    callback(null, filename);
  },
});

const fileFilter = (req, file, callback) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "application/pdf" // Allow PDF for resumes
  ) {
    callback(null, true);
  } else {
    callback(null, false);
    callback(new Error("Only png, jpg, jpeg, and pdf files are accepted"));
  }
};

const multerConfig = multer({ storage, fileFilter });

module.exports = multerConfig;
