import { asyncHandler } from "../utils/asyncHandler.js";
import { WatchedMovie } from "../models/movie.model.js";

const getWatchedMovies = asyncHandler(async (req, res) => {
    try {
        const { user_id } = req.params;
        const watchedMovies = await WatchedMovie.find({ user_id });

        res.status(200).json({
            success: true,
            data: watchedMovies,
        });
    } catch (error) {
        console.error("Error fetching watched movies:", error);
        res.status(500).json({
            success: false,
            error: "Server Error",
        });
    }
});

const addWatchedMovie = asyncHandler(async (req, res) => {
    const { title, user_id, poster_path, id } = req.body;

    try {
        const existingMovie = await WatchedMovie.findOne({ id, user_id });

        if (existingMovie) {
            res.status(201).json({ success: true, data: existingMovie });
        } else {
            const newWatchedMovie = new WatchedMovie({
                title,
                user_id,
                poster_path,
                id,
            });

            await newWatchedMovie.save();

            res.status(201).json({ success: true, data: newWatchedMovie });
        }
    } catch (error) {
        console.error("Error adding WatchedMovie:", error);
        res.status(500).json({ success: false, error: "Server Error" });
    }
});


const deleteWatchedMovie = asyncHandler(async (req, res) => {
    const { user_id, id } = req.params;
    try {
        const result = await WatchedMovie.deleteMany({ user_id, id });

        if (result.deletedCount >= 1) {
            res.status(200).json({ success: true, message: `WatchedMovie with id ${id} for user_id ${user_id} deleted successfully` });
        } else {
            res.status(404).json({ success: false, error: `WatchedMovie with id ${id} for user_id ${user_id} not found` });
        }
    } catch (error) {
        console.error("Error deleting WatchedMovie:", error);
        res.status(500).json({ success: false, error: "Server Error" });
    }
});

const getPaginateWatchedMovies = asyncHandler(async (req, res) => {
    try {
        const { user_id, page, pageSize } = req.params;

        const pageNumber = parseInt(page, 10) || 1;
        const limit = parseInt(pageSize, 10) || 10;

        const skip = (pageNumber - 1) * limit;

        const watchedMovies = await WatchedMovie.find({ user_id })
            .skip(skip)
            .limit(limit);

        const totalCount = await WatchedMovie.countDocuments({ user_id });

        res.status(200).json({
            success: true,
            data: watchedMovies,
            totalCount,
        });
    } catch (error) {
        console.error("Error fetching watched movies:", error);
        res.status(500).json({
            success: false,
            error: "Server Error",
        });
    }
});


export { addWatchedMovie, deleteWatchedMovie, getWatchedMovies, getPaginateWatchedMovies };
