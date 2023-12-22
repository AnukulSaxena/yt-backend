import { asyncHandler } from "../utils/asyncHandler.js";
import { Movie } from "../models/movie.model.js";


const getUnwatchedMovies = asyncHandler(async (req, res) => {
    const movies = await Movie.find();

    res.status(200).send(movies)
})

export { getUnwatchedMovies }