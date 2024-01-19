import mongoose from "mongoose";

const movieSchema = new mongoose.Schema({
    Release_Date: String,
    Title: String,
    Genre: String,
    Overview: String,
    Popularity: Number,
    Vote_Count: String,
    Vote_Average: String,
    Original_Language: String,
    Poster_Url: String
});

const watchedMovieSchema = new mongoose.Schema({
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
});

export const WatchedMovie = mongoose.model("WatchedMovie", watchedMovieSchema);
export const Movie = mongoose.model("Movie", movieSchema);
export const Mymovie = mongoose.model("Mymovie", movieSchema);