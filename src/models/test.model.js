import mongoose, { Schema } from 'mongoose'
const movieSchema = new mongoose.Schema({
    adult: Boolean,
    backdrop_path: String,
    belongs_to_collection: {
        id: Number,
        name: String,
        poster_path: String,
        backdrop_path: String,
    },
    budget: Number,
    genres: [
        {
            id: Number,
            name: String,
        },
    ],
    homepage: String,
    id: {
        type: Number,
        unique: true,
    },
    imdb_id: String,
    original_language: String,
    original_title: String,
    overview: String,
    popularity: Number,
    poster_path: String,
    production_companies: [
        {
            id: Number,
            name: String,
        },
    ],
    production_countries: [
        {
            iso_3166_1: String,
            name: String,
        },
    ],
    release_date: Date,
    revenue: Number,
    runtime: Number,
    spoken_languages: [
        {
            iso_639_1: String,
            name: String,
        },
    ],
    status: String,
    tagline: String,
    title: String,
    video: Boolean,
    vote_average: Number,
    vote_count: Number,
});

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;
