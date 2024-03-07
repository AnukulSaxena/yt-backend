import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.model.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { user } = req;
  const video = Video.findById(videoId);
  if (!video) {
    throw new ApiError(400, "Video not Found");
  }

  let message = "";
  let like = await Like.findOneAndDelete({
    video: videoId,
    likedBy: user._id,
  });
  message = "Like deleted successfully";

  if (!like) {
    like = await Like.create({
      video: videoId,
      likedBy: user._id,
    });

    if (!like) {
      throw new ApiError(500, "Something went wrong during creating like");
    }

    message = "Like created successfully";
  }
  res.status(200).json(new ApiResponse(200, like, message));
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const { user } = req;
  let message = "";

  let like = await Like.findOneAndDelete({
    comment: commentId,
    likedBy: user._id,
  });
  message = "Like deleted successfully";

  if (!like) {
    like = await Like.create({
      comment: commentId,
      likedBy: user._id,
    });
    if (!like) {
      throw new ApiError(500, "Something went wrong during creating like");
    }
    message = "Like created successfully";
  }
  res.status(200).json(new ApiResponse(200, like, message));
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const { user } = req;

  let message = "";
  let like = await Like.findOneAndDelete({
    tweet: tweetId,
    likedBy: user._id,
  });
  message = "Like deleted successfully";

  if (!like) {
    like = await Like.create({
      tweet: tweetId,
      likedBy: user._id,
    });
    if (!like) {
      throw new ApiError(500, "Something went wrong during creating like");
    }
    message = "Like created successfully";
  }
  res.status(200).json(new ApiResponse(200, like, message));
});

const getLikedVideos = asyncHandler(async (req, res) => {
  const { user } = req;

  const likedVideos = await Like.aggregate([
    {
      $match: {
        likedBy: new mongoose.Types.ObjectId(user._id),
        video: {
          $exists: true,
        },
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "video",
        foreignField: "_id",
        as: "likedVideos",
      },
    },
    {
      $unwind: "$likedVideos",
    },
    {
      $replaceRoot: {
        newRoot: "$likedVideos",
      },
    },
  ]);

  res
    .status(200)
    .json(
      new ApiResponse(200, likedVideos, "Liked videos fetched successfully")
    );
});

const getVideoInfo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { user } = req;

  const likedVideos = await Like.find({
    video: videoId,
  });
  const isLiked = likedVideos.some(
    (item) => String(item.likedBy) === String(req.user._id)
  );

  res.status(200).json(
    new ApiResponse(
      200,
      {
        isLiked,
        likeCount: likedVideos.length,
      },
      "Liked videos fetched successfully"
    )
  );
});

export {
  toggleCommentLike,
  toggleTweetLike,
  toggleVideoLike,
  getLikedVideos,
  getVideoInfo,
};
