import mongoose from "mongoose"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        fullname: {
            type: String,
            required: true,
            trim: true,
            index: true
        },

        avatar: {
            type: String // cloudinary url

        },

        coverImage: {
            type: String // cloudinary url
        },

        watchedHistory: {
            type: Schema.Types.ObjectId,
            ref: "Movie"
        },

        password: {
            type: String,
            required: true //[true, "password is required!"]
        },
        refreshToken: {
            type: String
        }

    }, { timestamps: true }
)


export const User = mongoose.model('User', userSchema)