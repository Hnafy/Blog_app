// multer.js
import multer from "multer";

const storage = multer.memoryStorage();

const uploadPhoto = multer({
    storage,
    fileFilter: function (req, file, cb) {
        if (file.mimetype.startsWith("image")) {
            cb(null, true);
        } else {
            cb({ message: "Unsupported file type" }, false);
        }
    },
    limits: { fileSize: 1024 * 1024 * 5 }, // 5MB
});

export default uploadPhoto;
