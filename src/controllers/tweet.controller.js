import mongoose from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTweet = asyncHandler(async (req, res) => {
  const { user } = req;
  const { content } = req.body;

  const tweet = await Tweet.create({
    content,
    owner: user._id,
  });

  if (!tweet) {
    throw new ApiError(500, "Something went wrong during tweet creation");
  }

  res
    .status(200)
    .json(new ApiResponse(200, tweet, "Tweet created successfully"));
});

const getUserTweets = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const tweets = await Tweet.find({
    owner: userId,
  });
  res
    .status(200)
    .json(new ApiResponse(200, tweets, "Tweets fetched successfully"));
});

const updateTweet = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const { tweetId } = req.params;
  const { user } = req;
  let tweet;

  tweet = await Tweet.findOneAndUpdate(
    {
      _id: tweetId,
      owner: user._id,
    },
    {
      $set: {
        content,
      },
    },
    { new: true }
  );

  if (!tweet) {
    throw new ApiError(400, "tweet not found");
  }
  res
    .status(200)
    .json(new ApiResponse(200, tweet, "Tweet updated successfully"));
});

const deleteTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const { user } = req;

  const deletedTweet = await Tweet.findOneAndDelete({
    _id: tweetId,
    owner: user._id,
  });

  if (!deletedTweet) {
    throw new ApiError(400, "tweet not found");
  }
  res
    .status(200)
    .json(new ApiResponse(200, deletedTweet, "Tweet deleted successfully"));
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
