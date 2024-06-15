import { v2 as cloudinary } from 'cloudinary';
import { response } from 'express';


cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    API_KEY: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_SECRET_API
});


const uploadCloudinary = async (localpath) => {
    try {
        if (!localpath) return null;

        cloudinary.uploader.upload(localpath, {
            resource_type: "auto"
        });
        console.log("file Uploaded ", response.url);
        return response;

    } catch (error) {
        fs.unlinkSync(localpath);
        return null;
    }
}

module.exports = { uploadCloudinary }
