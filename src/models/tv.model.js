import mongoose from "mongoose";


const watchedTvShowSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    user_id: {
        type: String,
        required: true,
    },
    poster_path: {
        type: String,
        required: true,
    },
    id: {
        type: Number,
        required: true,
    },
    vote_average:{
        type: Number,
        required: true,
    }
});

export const WatchedTvShow = mongoose.model("WatchedTvShow", watchedTvShowSchema);