// cloudinary.js
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function cloudinaryUploadImage(fileBuffer, filename) {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { public_id: filename },
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
        );
        uploadStream.end(fileBuffer);
    });
}
async function cloudinaryDeleteImage(publicId) {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        return result; // { result: 'ok' } if deleted successfully
    } catch (err) {
        throw new Error(err.message || "Cloudinary delete error");
    }
}
async function cloudinaryDeleteArrayOfImage(publicIds) {
    try {
        const result = await cloudinary.api.delete_resources(publicIds);
        return result; // { deleted: { "id1": "deleted", "id2": "deleted" } }
    } catch (err) {
        throw new Error(err.message || "Cloudinary bulk delete error");
    }
}

export {
    cloudinaryUploadImage,
    cloudinaryDeleteImage,
    cloudinaryDeleteArrayOfImage,
};
