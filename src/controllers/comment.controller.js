import mongoose from "mongoose"
import { Comment } from "../models/comment.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { Video } from "../models/video.model.js"

const getVideoComments = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    let { page = 1, limit = 10 } = req.query
    page = parseInt(page, 10) || 1;
    limit = parseInt(limit, 10) || 10;

    let video;
    try {
        video = await Video.findById(videoId)
    } catch (error) {
        throw new ApiError(400, "Invalid videoId")
    }

    if (!video) {
        throw new ApiError(400, "Video not found")
    }


    const comments = await Comment.aggregate([
        {
            $match: {
                video: new mongoose.Types.ObjectId(videoId)
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'owner',
                foreignField: '_id',
                as: 'ownerDetails'
            }
        },
        {
            $unwind: '$ownerDetails'
        },
        {
            $lookup: {
                from: 'likes',
                localField: '_id',
                foreignField: 'comment',
                as: 'likeDetails'
            }
        },
        {
            $project: {
                'content': 1,
                'createdAt': 1,
                'owner_avatar': '$ownerDetails.avatar',
                'owner_username': '$ownerDetails.username',
                'numberOfLikes': { $size: "$likeDetails" }
            }
        },
        {
            $skip: (page - 1) * limit
        },
        {
            $limit: limit
        }

    ])

    if (!comments) {
        throw new ApiError(400, "No Comments")
    }

    res.status(200).json(
        new ApiResponse(200, comments, "Comments fetched successfully")
    )


})

const addComment = asyncHandler(async (req, res) => {
    const { content } = req.body;
    if (!content?.trim()) {
        throw new ApiError(400, "Content is required")
    }
    const { videoId } = req.params;
    let video;
    try {
        video = await Video.findById(videoId)
    } catch (error) {
        throw new ApiError(400, "Invalid videoId")
    }
    if (!video) {
        throw new ApiError(400, "Video not found")
    }

    const user = req.user;
    const comment = await Comment.create({
        content,
        video: videoId,
        owner: user._id
    })
    if (!comment) {
        throw new ApiError(400, "Something went wrong during comment creation")
    }

    res.status(200).json(
        new ApiResponse(200, comment, "Commented successfully")
    )


})

const updateComment = asyncHandler(async (req, res) => {
    const { user } = req;
    const { commentId } = req.params;
    const { content } = req.body;
    if (!content?.trim()) {
        throw new ApiError(400, "Content is required")
    }

    let comment;
    try {
        comment = await Comment.findOneAndUpdate({
            '_id': commentId,
            'owner': user._id
        }, {
            $set: {
                content: content
            }
        },
            { new: true }
        )
    } catch (error) {
        throw new ApiError(400, "Invalid CommentId")
    }

    if (!comment) {
        throw new ApiError(400, "Comment does not exist")
    }



    res.status(200).json(
        new ApiResponse(200, comment, "Comment updated successfully")
    )
})

const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const { user } = req;

    let deletedComment;
    try {
        deletedComment = await Comment.findOneAndDelete({
            '_id': commentId,
            'owner': user._id
        })
    } catch (error) {
        throw new ApiError(400, "Invalid commentId")
    }
    console.log(deletedComment)
    if (!deletedComment) {
        throw new ApiError(400, "Comment does not found")
    }

    res.status(200).json(
        new ApiResponse(200, deletedComment, "Comment deleted successfully")
    )
})

export {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment
}