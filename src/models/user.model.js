import mongoose from "mongoose"

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

        watchedHistory: [
            {
                id: Number,
                title: String,
                image_path: String,
            }
        ],

        password: {
            type: String,
            required: true //[true, "password is required!"]
        }

    }, { timestamps: true }
)


export const User = mongoose.model('User', userSchema)