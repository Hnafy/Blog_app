import { v2 as cloudinary } from "cloudinary";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
dotenv.config();

// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function cloudinaryUploadImage(imageName) {
    // Upload an image
    const __dirname = dirname(fileURLToPath(import.meta.url));
    const uploadResult = await cloudinary.uploader
        .upload(
            path.join(__dirname, "/uploads/", imageName), // imageName>> ${req.file.filename}
            {
                public_id: imageName,
            }
        )
        .catch((error) => {
            console.log(error);
        });

    return uploadResult;
}

async function cloudinaryDeleteImage(publicId) {
    // delete an image
    try {
        const deleteImage = await cloudinary.uploader.destroy(publicId);
        return deleteImage;
    } catch (err) {
        return err;
    }
}
async function cloudinaryDeleteArrayOfImage(publicIds) {
    // delete all images
    try {
        const deleteImages = await cloudinary.v2.api.delete_resources(publicIds)
        return deleteImages;
    } catch (err) {
        return err;
    }
}

export { cloudinaryUploadImage, cloudinaryDeleteImage,cloudinaryDeleteArrayOfImage };
