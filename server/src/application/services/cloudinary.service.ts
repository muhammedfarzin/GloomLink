import fs from "fs";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

export const uploadToCloudinary = async (
  path: string,
  folder: string = "uploads",
  deleteOrginal: boolean = true
) => {
  try {
    const data = await cloudinary.uploader.upload(path, { folder: folder });

    if (deleteOrginal) {
      fs.unlink(path, (err) => {
        if (err) console.log("Image is not deleted");
      });
    }

    return data.secure_url;
  } catch (err) {
    throw err;
  }
};

export const removeFromCloudinary = async (path: string) => {
  const publicId = path.split("/").slice(-2).join("/").split(".")[0];
  cloudinary.uploader.destroy(publicId, (error) => {
    if (error) return console.log(error);
  });
};
