import mongoose, { isValidObjectId } from "mongoose"
import { Video } from "../models/video.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { deleteFileOnCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js"


const publishAVideo = asyncHandler(async (req, res) => {

    // userAuthentication
    // valididation for all required stuff from user


    const { title, description } = req.body;
    if ([title, description].some((field) => (
        field.trim() === ""
    ))) {
        throw new ApiError(400, "All fields are required")
    }

    console.log(req.files);

    const videoLocalPath = req.files?.videoFile[0]?.path;
    const thumbnailLocalPath = req.files?.thumbnail[0]?.path;

    if (
        !videoLocalPath ||
        !thumbnailLocalPath ||
        !req.files?.videoFile[0]?.mimetype.includes('video') ||
        !req.files?.thumbnail[0]?.mimetype.includes('image')) {
        throw new ApiError(400, "Video and thumbnail are required or Invalid file type");
    }

    const videoFile = await uploadOnCloudinary(videoLocalPath)
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)

    if (!videoFile || !thumbnail) {
        throw new ApiError(500, "Error while video or thumbnail")
    }

    const duration = Math.floor(videoFile.duration)
    console.log(duration, videoFile.duration)

    const video = await Video.create({
        videoFile: videoFile.url,
        thumbnail: thumbnail.url,
        title,
        description,
        duration,
        owner: req.user

    })

    if (!video) {
        throw new ApiError(500, "Something went wrong during video creation")
    }

    res.status(200).json(new ApiResponse(200, video, "Video published successfully"))
})

const getAllVideos = asyncHandler(async (req, res) => {
    let { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;

    try {
        await User.findById(userId)
    } catch (error) {
        throw new ApiError(400, "Invalid userId")
    }

    page = parseInt(page, 10) || 1;
    limit = parseInt(limit, 10) || 10;

    const pipeline = [
        {
            $match: {
                owner: userId?.trim() ? new mongoose.Types.ObjectId(userId) : { $exists: true, $ne: null },
                isPublished: true,
                title: { $regex: new RegExp(query?.trim().split(/\s+/).join('|'), 'i') }
            },
        },
        sortBy ? { $sort: { [sortBy]: sortType === 'desc' ? -1 : 1 } } : undefined,
        {
            $skip: (page - 1) * limit
        },
        {
            $limit: limit
        }
    ];


    const filteredPipeline = pipeline.filter(Boolean);
    const videos = await Video.aggregate(filteredPipeline);


    res.status(200).json(
        new ApiResponse(200, videos, "Videos fetched successfully")
    );
});

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    let video;
    try {
        video = await Video.findById(videoId)
    } catch (error) {
        throw new ApiError(400, "Invalid videoId ")
    }

    if (!video) {
        throw new ApiError(400, "Video does not exist")
    }

    res.status(200).json(
        new ApiResponse(200, video, "Video fetched successfully")
    )

})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    let video;
    try {
        video = await Video.findById(videoId);
    } catch (error) {
        throw new ApiError(400, "Invalid videoId")
    }

    if (!video) {
        throw new ApiError(400, "Video does not exist")
    }

    const { title, description } = req.body;
    if (
        !title?.trim() ||
        !description?.trim() ||
        !req.file
    ) {
        throw new ApiError(400, "All fields are required")
    }

    if (!req.file.mimetype.includes('image')) {
        throw new ApiError(400, "Invalid file type")
    }

    const thumbnail = await uploadOnCloudinary(req.file.path)

    if (!thumbnail) {
        throw new ApiError(500, "Something went wrong during file uploading")
    }

    const updatedVideo = await Video.findByIdAndUpdate(
        videoId,
        {
            $set: {
                title,
                description,
                thumbnail: thumbnail.url
            }
        },
        { new: true }
    )
    if (!updatedVideo) {
        throw new ApiError(500, "Something went wrong during updation")
    }

    deleteFileOnCloudinary(video.thumbnail)



    res.status(200).json(
        new ApiResponse(200, updatedVideo, "Video details updated successfully")
    )
})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    let response
    try {
        response = await Video.findByIdAndDelete(videoId)
    } catch (error) {
        throw new ApiError(400, "Invalid VideoId")
    }
    if (!response) {
        throw new ApiError(400, "Video does not exist")
    }

    res.status(200).json(
        new ApiResponse(200, {}, "Video deleted successfully")
    )

})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const { user } = req
    let videoOwnerCheck;
    try {
        videoOwnerCheck = await Video.findOne({
            _id: videoId,
            owner: user._id,
        });
    } catch (error) {
        throw new ApiError(400, "Invalid videoId")
    }

    if (!videoOwnerCheck) {
        throw new ApiError(404, "Permission denied");
    }


    const updatedVideo = await Video.findByIdAndUpdate(
        videoId,
        { $set: { isPublished: !videoOwnerCheck.isPublished } },
        { new: true }
    );
    if (!updatedVideo) {
        throw new ApiError(500, "something went wrong during updation")
    }

    res.status(200).json(
        new ApiResponse(200, updatedVideo, "Publish status changed successfully")
    )

})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}