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

export const Movie = mongoose.model("Movie", movieSchema);
export const Mymovie = mongoose.model("Mymovie", movieSchema);