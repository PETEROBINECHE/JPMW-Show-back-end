import multer from "multer";

const upload = multer({dest: "uploads/"});

export default upload;


const storage = multer.memoryStorage();

export const uploads = multer({
    storage,
    limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  }
});