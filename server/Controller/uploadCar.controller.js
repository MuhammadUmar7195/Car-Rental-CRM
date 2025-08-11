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
                    { folder: "car-rental-images" },
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

        res.status(200).json({ success: true, url: result.secure_url });
    } catch (error) {
       next(error);
    }
}