import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  deleteFileOnCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";
import { Subscription } from "../models/subscription.model.js";

const getAllVideosCount = asyncHandler(async (req, res) => {
  let { userId } = req.query;
  console.log(userId);

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(400, "User Not Found");
  }

  const pipeline = [
    {
      $match: {
        owner: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $count: "TotalVideos",
    },
  ];
  const videos = await Video.aggregate(pipeline);

  res
    .status(200)
    .json(new ApiResponse(200, videos, "Video Count fetched successfully"));
});

const getAllVideos = asyncHandler(async (req, res) => {
  let { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;

  page = parseInt(page, 10) || 1;
  limit = parseInt(limit, 10) || 10;

  const pipeline = [
    {
      $match: {
        owner: userId?.trim()
          ? new mongoose.Types.ObjectId(userId)
          : { $exists: true, $ne: null },
        isPublished: true,
        title: {
          $regex: new RegExp(query?.trim().split(/\s+/).join("|"), "i"),
        },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "videoOwner",
      },
    },
    {
      $unwind: "$videoOwner",
    },
    {
      $project: {
        _id: 1,
        title: 1,
        views: 1,
        videoFile: 1,
        createdAt: 1,
        thumbnail: 1,
        ownerName: "$videoOwner.fullName",
        ownerId: "$videoOwner._id",
        ownerAvatar: "$videoOwner.avatar",
      },
    },
    sortBy ? { $sort: { [sortBy]: sortType === "desc" ? -1 : 1 } } : undefined,
    {
      $skip: (page - 1) * limit,
    },
    {
      $limit: limit,
    },
  ];

  const filteredPipeline = pipeline.filter(Boolean);
  const videos = await Video.aggregate(filteredPipeline);

  res
    .status(200)
    .json(new ApiResponse(200, videos, "Videos fetched successfully"));
});

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  const videoLocalPath = req.files?.videoFile[0]?.path;
  const thumbnailLocalPath = req.files?.thumbnail[0]?.path;

  if (
    !videoLocalPath ||
    !thumbnailLocalPath ||
    !req.files?.videoFile[0]?.mimetype.includes("video") ||
    !req.files?.thumbnail[0]?.mimetype.includes("image")
  ) {
    throw new ApiError(
      400,
      "Video and thumbnail are required or Invalid file type"
    );
  }

  const videoFile = await uploadOnCloudinary(videoLocalPath);
  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

  if (!videoFile || !thumbnail) {
    throw new ApiError(500, "Error while video or thumbnail");
  }

  const duration = Math.floor(videoFile.duration);

  const video = await Video.create({
    videoFile: videoFile.url,
    thumbnail: thumbnail.url,
    title,
    description,
    duration,
    owner: req.user,
    ownerName: req.user.fullName,
    ownerAvatar: req.user.avatar,
  });

  if (!video) {
    throw new ApiError(500, "Something went wrong during video creation");
  }

  res
    .status(200)
    .json(new ApiResponse(200, video, "Video published successfully"));
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const video = await Video.findById(videoId).populate({
    path: "owner",
    select: "_id username fullName avatar coverImage",
  });

  if (!video) {
    throw new ApiError(400, "Video does not exist");
  }

  video.views += 1;
  await video.save();

  res
    .status(200)
    .json(new ApiResponse(200, video, "Video fetched successfully"));
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { user } = req;
  const { title, description } = req.body;

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(400, "Video does not exist");
  }

  if (String(video.owner) !== String(user._id)) {
    throw new ApiError(400, "Permission denied");
  }

  if (!req.file || !req.file.mimetype.includes("image")) {
    throw new ApiError(400, "Invalid file");
  }

  const thumbnail = await uploadOnCloudinary(req.file.path);

  if (!thumbnail) {
    throw new ApiError(500, "Something went wrong during file uploading");
  }

  const prevThumbnail = video.thumbnail;

  video.title = title;
  video.description = description;
  video.thumbnail = thumbnail.url;

  const updatedVideo = await video.save();

  deleteFileOnCloudinary(prevThumbnail);

  res
    .status(200)
    .json(
      new ApiResponse(200, updatedVideo, "Video details updated successfully")
    );
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { user } = req;

  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(400, "Video does not exist");
  }

  if (String(video.owner) !== String(user._id)) {
    throw new ApiError(400, "Permission denied");
  }

  const response = await Video.findByIdAndDelete(videoId);

  deleteFileOnCloudinary(response?.videoFile, "video");
  deleteFileOnCloudinary(response?.thumbnail);

  res
    .status(200)
    .json(new ApiResponse(200, response, "Video deleted successfully"));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { user } = req;

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(400, "Video does not exist");
  }
  if (String(video?.owner) !== String(user._id)) {
    throw new ApiError(400, "Permission denied");
  }

  video.isPublished = !video.isPublished;

  const updatedVideo = await video.save();

  res
    .status(200)
    .json(
      new ApiResponse(200, updatedVideo, "Publish status changed successfully")
    );
});

const testVideoController = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const response = await Video.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(videoId),
      },
    },
  ]);
  console.log(response);
  if (!response?.length) {
    throw new ApiError(400, "Something went wrong");
  }

  res.status(200).json(new ApiResponse(200, response, "sucees"));
});

const getSubscriptionVideos = asyncHandler(async (req, res) => {
  const { user } = req;
  let { page = 1, limit = 10 } = req.query;
  page = parseInt(page, 10) || 1;
  limit = parseInt(limit, 10) || 10;

  const pipeline = [
    {
      $match: {
        subscriber: new mongoose.Types.ObjectId(user._id),
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "channel",
        foreignField: "owner",
        as: "channelVideos",
      },
    },
    {
      $unwind: "$channelVideos",
    },
    {
      $replaceRoot: {
        newRoot: "$channelVideos",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "videoOwner",
      },
    },
    {
      $unwind: "$videoOwner",
    },
    {
      $project: {
        _id: 1,
        title: 1,
        views: 1,
        videoFile: 1,
        createdAt: 1,
        thumbnail: 1,
        ownerName: "$videoOwner.fullName",
        ownerId: "$videoOwner._id",
        ownerAvatar: "$videoOwner.avatar",
      },
    },
    {
      $skip: (page - 1) * limit,
    },
    {
      $limit: limit,
    },
  ];

  const filteredPipeline = pipeline.filter(Boolean);
  const videos = await Subscription.aggregate(filteredPipeline);

  res
    .status(200)
    .json(
      new ApiResponse(200, videos, " Subscribed Videos fetched successfully")
    );
});

export {
  testVideoController,
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
  getAllVideosCount,
  getSubscriptionVideos,
};
