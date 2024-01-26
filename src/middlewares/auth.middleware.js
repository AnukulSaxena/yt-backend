import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req, _, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        console.log("auth middleware :: verifyJWT :: req.cookies.accesstoken", req.cookies?.accessToken)
        console.log("auth middleware :: verifyJWT :: req.header", req.header("Authorization")?.replace("Bearer ", ""));
        console.log(token);
        if (!token) {
            throw new ApiError(401, "Unauthorized request")
        }
        console.log("auth middleware :: verifyJWT :: after token check")

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        console.log("auth middleware :: verifyJWT :: decode Token")

        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")

        if (!user) {

            throw new ApiError(401, "Invalid Access Token")
        }

        req.user = user;
        next()
    } catch (error) {

        throw new ApiError(401, error?.message || "Invalid access token")
    }

})