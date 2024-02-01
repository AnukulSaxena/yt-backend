import mongoose, { isValidObjectId } from "mongoose"
import { Video } from "../models/video.model.js"
import { Playlist } from "../models/playlist.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const { name, description } = req.body
    const { user } = req
    if (!name?.trim() || !description?.trim()) {
        throw new ApiError(400, "All fields are required")
    }

    const playlist = await Playlist.create({
        name,
        description,
        owner: user._id
    })

    if (!playlist) {
        throw new ApiError(500, "Something went wrong during playlist creation")
    }

    res.status(200).json(
        new ApiResponse(200, playlist, "Playlist created successfully")
    )
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const { userId } = req.params

    let playlists;
    try {
        playlists = await Playlist.find({
            owner: userId
        })
    } catch (error) {
        throw new ApiError(400, "Invalid userId")
    }
    res.status(200).json(
        new ApiResponse(200, playlists, "Playlist fetched successfully")
    )
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const { playlistId } = req.params

    let playlist;
    try {
        playlist = await Playlist.findById(playlistId)
    } catch (error) {
        throw new ApiError(400, "Invalid playlistId")
    }

    if (!playlist) {
        throw new ApiError(400, "Playlist not found")
    }

    res.status(200).json(
        new ApiResponse(200, playlist, "Playlist fetched successfully")
    )
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params;

    try {
        const playlist = await Playlist.findById(playlistId);

        if (!playlist) {
            throw new ApiError(400, 'Playlist not found')
        }

        if (!mongoose.Types.ObjectId.isValid(videoId)) {
            throw new ApiError(400, 'Invalid videoId')
        }

        const video = await Video.findById(videoId);

        if (!video) {
            throw new ApiError(400, 'Video not found')
        }

        if (!playlist.videos.includes(videoId)) {
            playlist.videos.push(videoId);

            await playlist.save();
        }

        res.status(200).json(
            new ApiResponse(200, playlist, "Video added successfully")
        );
    } catch (error) {
        throw new ApiError(500, error.message)
    }
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params;

    try {
        const playlist = await Playlist.findById(playlistId);

        if (!playlist) {
            throw new ApiError(400, 'Playlist not found');
        }

        if (!mongoose.Types.ObjectId.isValid(videoId)) {
            throw new ApiError(400, 'Invalid videoId');
        }

        const video = await Video.findById(videoId);

        if (!video) {
            throw new ApiError(400, 'Video not found');
        }

        const videoIndex = playlist.videos.indexOf(videoId);

        if (videoIndex !== -1) {
            playlist.videos.splice(videoIndex, 1);


            await playlist.save();

            res.status(200).json(
                new ApiResponse(200, playlist, "Video removed successfully")
            );
        } else {
            res.status(400).json(
                new ApiResponse(400, null, "Video not found in the playlist")
            );
        }
    } catch (error) {
        throw new ApiError(500, error.message);
    }

})

const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params

    let playlist;

    try {
        playlist = await Playlist.findByIdAndDelete(playlistId)
    } catch (error) {
        throw new ApiError(400, "Invalid playlistId")
    }

    if (!playlist) {
        throw new ApiError(400, "Playlist not found")
    }

    res.status(200).json(
        new ApiResponse(200, playlist, "Playlist deleted successfully")
    )
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    const { name, description } = req.body

    if (!name?.trim() || !description?.trim()) {
        throw new ApiError(400, "All fields are required")
    }

    let playlist;
    try {
        playlist = await Playlist.findByIdAndUpdate(playlistId,
            {
                $set: {
                    name,
                    description
                }
            }, { new: true })

    } catch (error) {
        throw new ApiError(400, "Invalid playlistId")
    }

    if (!playlist) {
        throw new ApiError("Playlist not found")
    }
    res.status(200).json(
        new ApiResponse(200, playlist, "Playlist updated successfully")
    )
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}