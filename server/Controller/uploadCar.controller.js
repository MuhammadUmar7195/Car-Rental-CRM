import cloudinary from "../Utils/cloudinary.js";
import streamifier from "streamifier";
import ErrorHandler from "../Utils/ErrorHandler.js";

// upload the rental car files in cloudinary
export const uploadFile = async (req, res, next) => {
    try {
        if (!req.file) {
            return next(new ErrorHandler("No file uploaded.", 400));
        }

        // function to handle the file stream upload to cloudinary
        const streamUpload = (fileBuffer) => {
            return new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    {
                        folder: "car-rental-images",
                        resource_type: "image",
                        type: "upload", 
                        use_filename: true,
                        unique_filename: true,
                        overwrite: false,
                        quality: "auto",
                        transformation: [
                            {
                                width: 1200,
                                height: 800,
                                crop: "limit",
                                quality: "auto:good"
                            }
                        ]
                    },
                    (error, result) => {
                        if (result) {
                            resolve(result);
                        } else {
                            reject(error);
                        }
                    }
                );
                streamifier.createReadStream(fileBuffer).pipe(stream);
            });
        };

        const result = await streamUpload(req.file.buffer);

        res.status(200).json({ 
            success: true, 
            url: result.secure_url,
            public_id: result.public_id
        });
    } catch (error) {
        next(new ErrorHandler("Failed to upload image to cloud storage.", 500));
    }
}