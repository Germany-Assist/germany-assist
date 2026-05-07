import multer from "multer";

const multerUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    files: 28,
    fileSize: 3 * 1024 * 1024,
  },
});

export default multerUpload;
