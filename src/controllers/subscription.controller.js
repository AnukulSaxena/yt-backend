import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  const { user } = req;

  if (channelId === String(user?._id)) {
    throw new ApiError(400, "Invalid Operation");
  }

  let message = "";
  const subscription = await Subscription.findOneAndDelete({
    subscriber: user._id,
    channel: channelId,
  });
  message = "Unsubscribed successfully";

  if (!subscription) {
    subscription = await Subscription.create({
      subscriber: user._id,
      channel: channelId,
    });
    message = "Subscribed successfully";
  }
  if (!subscription) {
    throw new ApiError(500, "Something went wrong during subscribing");
  }

  res.status(200).json(new ApiResponse(200, subscription, message));
});

const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  const channels = await Subscription.aggregate([
    {
      $match: {
        channel: new mongoose.Types.ObjectId(channelId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "subscriber",
        foreignField: "_id",
        as: "channelSubscribers",
      },
    },
    {
      $unwind: "$channelSubscribers",
    },
    {
      $replaceRoot: {
        newRoot: "$channelSubscribers",
      },
    },
  ]);

  res
    .status(200)
    .json(
      new ApiResponse(200, channels, "Channel subscribers fetched successfully")
    );
});

const getUserChannelSubscribersCount = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  const channels = await Subscription.find({
    channel: channelId,
  });

  const isSubscribed = channels.some(
    (item) => String(item.subscriber) === String(req.user._id)
  );

  res.status(200).json(
    new ApiResponse(
      200,
      {
        length: channels?.length,
        isSubscribed,
      },
      "Channel subscribers Count fetched successfully"
    )
  );
});

const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { user } = req;

  const subscribers = await Subscription.aggregate([
    {
      $match: {
        subscriber: user._id,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "channel",
        foreignField: "_id",
        as: "subscribedChannels",
      },
    },
    {
      $unwind: "$subscribedChannels",
    },
    {
      $replaceRoot: {
        newRoot: "$subscribedChannels",
      },
    },
  ]);

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        subscribers,
        "Channel subscribers fetched successfully"
      )
    );
});

export {
  toggleSubscription,
  getUserChannelSubscribers,
  getSubscribedChannels,
  getUserChannelSubscribersCount,
};
