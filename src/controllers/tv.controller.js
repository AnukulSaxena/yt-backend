import { asyncHandler } from "../utils/asyncHandler.js";
import { WatchedTvShow } from "../models/tv.model.js";
import { DB_NAME } from "../constants.js";
import mongoose from "mongoose";

const getWatchedTvShows = asyncHandler(async (req, res) => {
    try {
        const { user_id } = req.params;
        const watchedTvShows = await WatchedTvShow.find({ user_id });

        res.status(200).json({
            success: true,
            data: watchedTvShows,
        });
    } catch (error) {
        console.error("Error fetching watched TvShows:", error);
        res.status(500).json({
            success: false,
            error: "Server Error",
        });
    }
});

const addWatchedTvShow = asyncHandler(async (req, res) => {
    const { title, user_id, poster_path, id , vote_average } = req.body;

    try {
        const existingTvShow = await WatchedTvShow.findOne({ id, user_id });


        if (existingTvShow) {
            res.status(201).json({ success: true, data: existingTvShow });
        } else {
            const newWatchedTvShow = new WatchedTvShow({
                title,
                user_id,
                poster_path,
                id,
                vote_average
            });

            await newWatchedTvShow.save();

            res.status(201).json({ success: true, data: newWatchedTvShow });
        }
    } catch (error) {
        console.error("Error adding WatchedTvShow:", error);
        res.status(500).json({ success: false, error: "Server Error" });
    }
});

const deleteWatchedTvShow = asyncHandler(async (req, res) => {
    const { user_id, id } = req.params;
    try {
        const result = await WatchedTvShow.deleteMany({ user_id, id });

        if (result.deletedCount >= 1) {
            res.status(200).json({ success: true, message: `WatchedTvShow with id ${id} for user_id ${user_id} deleted successfully` });
        } else {
            res.status(404).json({ success: false, error: `WatchedTvShow with id ${id} for user_id ${user_id} not found` });
        }
    } catch (error) {
        console.error("Error deleting WatchedTvShow:", error);
        res.status(500).json({ success: false, error: "Server Error" });
    }
});

const getPaginateWatchedTvShows = asyncHandler(async (req, res) => {
    try {
        const { user_id, page, pageSize } = req.params;

        const pageNumber = parseInt(page, 10) || 1;
        const limit = parseInt(pageSize, 10) || 10;

        const skip = (pageNumber - 1) * limit;

        const watchedTvShows = await WatchedTvShow.find({ user_id })
            .skip(skip)
            .limit(limit);

        const totalCount = await WatchedTvShow.countDocuments({ user_id });
        console.log("Watched Tvshow",watchedTvShows , " count",totalCount)

        res.status(200).json({
            success: true,
            data: watchedTvShows,
            totalCount,
        });
    } catch (error) {
        console.error("Error fetching watched TvShows:", error);
        res.status(500).json({
            success: false,
            error: "Server Error",
        });
    }
});

const testWatchedTvShow = asyncHandler(async (req, res) => {
    const watchedTvShowsArray = req.body.watchedTvShowsArray;
    console.log(watchedTvShowsArray);
    const client = mongoose.connection.getClient();
    console.log(client)

    try {
        console.log("lk")
        const db = client.db('moviesDB');
        console.log("lk")
        const collection = db.collection('WatchedTvShowsTest');
        console.log("lk")
        // Convert array to object
        const watchedTvShowsObject = {};
        watchedTvShowsArray.forEach(TvShow => {
            watchedTvShowsObject[TvShow.id] = { title:TvShow.title, watched: true };
            // You can add more properties as needed
        });
        const newObject = {}

        newObject['sfjslkdfsdfi'] = { watchedTvShowsObject }

        // Save the converted data to MongoDB
        await collection.insertOne(newObject);

        res.status(201).json({ success: true, message: 'Watched TvShows data saved successfully!' });

    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, error: 'Error saving data to MongoDB' });

    }

})

export { testWatchedTvShow, addWatchedTvShow, deleteWatchedTvShow, getWatchedTvShows, getPaginateWatchedTvShows };
