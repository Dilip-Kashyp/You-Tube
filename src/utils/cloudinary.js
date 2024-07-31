var cloudinary = require('cloudinary').v2; // use 'v2' for the latest cloudinary version
const fs = require("fs");

cloudinary.config({
    cloud_name: 'dpvzikaqn',
    api_key: '629693144799451',
 // api_key: process.env.CLOUD_API_KEY, // corrected key name
//  api_secret: process.env.CLOUD_SECRET_API
    api_secret: 'hF121Lww5LvpCRmZTzntJU3fnCc'
});

const uploadCloudinary = async (localpath) => {
    try {
        if (!localpath) return null;

        const result = await cloudinary.uploader.upload(localpath, {
            resource_type: "auto"
        });

        // Optionally delete the local file after successful upload
        fs.unlinkSync(localpath);

        return result;

    } catch (error) {
        console.error("Error uploading to Cloudinary:", error);
        if (fs.existsSync(localpath)) {
            fs.unlinkSync(localpath);
        }
        return null;
    }
};

module.exports = uploadCloudinary;


module.exports =  uploadCloudinary 
