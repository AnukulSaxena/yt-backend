import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    console.log("file is uploaded on cloudinary ", response.url);
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath);
    return null;
  }
};

async function deleteFileOnCloudinary(fileUrl, resource_type = "image") {
  try {
    if (!fileUrl?.trim()) return;
    const publicId = fileUrl.split("/").pop().split(".")[0];
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type,
    });

    console.log(result);
    if (result.result === "ok") {
      console.log("File deleted successfully.");
    } else {
      console.error("Failed to delete the File.");
    }
  } catch (error) {
    console.error("Error deleting File:", error.message);
  }
}

export { uploadOnCloudinary, deleteFileOnCloudinary };
