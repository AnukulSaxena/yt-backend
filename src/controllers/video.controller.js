import mongoose from "mongoose"
import { Video } from "../models/video.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { deleteFileOnCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js"
import { Subscription } from "../models/subscription.model.js"

const publishAVideo = asyncHandler(async (req, res) => {

    const { title, description } = req.body;
    if ([title, description].some((field) => (
        field.trim() === ""
    ))) {
        throw new ApiError(400, "All fields are required")
    }

    // console.log(req.user);

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
        owner: req.user,
        ownerName: req.user.fullName,
        ownerAvatar: req.user.avatar

    })

    if (!video) {
        throw new ApiError(500, "Something went wrong during video creation")
    }

    res.status(200).json(new ApiResponse(200, video, "Video published successfully"))
})

const getAllVideos = asyncHandler(async (req, res) => {

    let { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
    console.log(userId, "GetAllVideos")
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
        {
            $lookup: {
                'from': 'users',
                'localField': 'owner',
                'foreignField': '_id',
                'as': 'videoOwner'
            }
        }, {
            '$unwind': '$videoOwner'
        }, {
            '$project': {
                '_id': 1,
                'title': 1,
                'views': 1,
                'videoFile': 1,
                'createdAt': 1,
                'thumbnail': 1,
                'ownerName': '$videoOwner.fullName',
                'ownerId': '$videoOwner._id',
                'ownerAvatar': '$videoOwner.avatar'
            }
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

const getSubscriptionVideos = asyncHandler(async (req, res) => {
    const { user } = req;
    let { page = 1, limit = 10 } = req.query;
    console.log(req.query, "Sometifhfskdfjsdlksdf ")
    page = parseInt(page, 10) || 1;
    limit = parseInt(limit, 10) || 10;

    const pipeline = [
        {
            '$match': {
                'subscriber': new mongoose.Types.ObjectId(user._id)
            }
        }, {
            '$lookup': {
                'from': 'videos',
                'localField': 'channel',
                'foreignField': 'owner',
                'as': 'channelVideos'
            }
        }, {
            '$unwind': '$channelVideos'
        }, {
            '$replaceRoot': {
                'newRoot': '$channelVideos'
            }
        },
        {
            $lookup: {
                'from': 'users',
                'localField': 'owner',
                'foreignField': '_id',
                'as': 'videoOwner'
            }
        }, {
            '$unwind': '$videoOwner'
        }, {
            '$project': {
                '_id': 1,
                'title': 1,
                'views': 1,
                'videoFile': 1,
                'createdAt': 1,
                'thumbnail': 1,
                'ownerName': '$videoOwner.fullName',
                'ownerId': '$videoOwner._id',
                'ownerAvatar': '$videoOwner.avatar'
            }
        },
        {
            $skip: (page - 1) * limit
        },
        {
            $limit: limit
        }
    ];

    const filteredPipeline = pipeline.filter(Boolean);
    const videos = await Subscription.aggregate(filteredPipeline);

    res.status(200).json(
        new ApiResponse(200, videos, " Subscribed Videos fetched successfully")
    );

});

const getAllVideosCount = asyncHandler(async (req, res) => {
    let { userId } = req.query;

    try {
        await User.findById(userId)
    } catch (error) {
        throw new ApiError(400, "Invalid userId")
    }


    const pipeline =
        [
            {
                '$match': {
                    'owner': new mongoose.Types.ObjectId('65c8988cfc69fb27cd793685')
                }
            }, {
                '$count': 'TotalVideos'
            }
        ]
        ;


    const videos = await Video.aggregate(pipeline);


    res.status(200).json(
        new ApiResponse(200, videos, "Video Count fetched successfully")
    );
});

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    let video;
    try {
        video = await Video.findById(videoId)
            .populate({
                path: 'owner',
                select: '_id username fullName avatar coverImage'
            })
    } catch (error) {
        throw new ApiError(400, "Invalid videoId ")
    }

    if (!video) {
        throw new ApiError(400, "Video does not exist")
    }

    video.views += 1;
    await video.save();

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

const testVideoController = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const response = await Video.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(videoId)
            }
        }
    ])
    console.log(response)
    if (!response?.length) {
        throw new ApiError(400, "Something went wrong")
    }

    res.status(200).json(
        new ApiResponse(200, response, 'sucees')
    )
})

export {
    testVideoController,
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus,
    getAllVideosCount,
    getSubscriptionVideos
}