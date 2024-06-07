import { Listing } from "../models/listing.model.js"
import { User } from "../models/user.model.js"
import { errorHandler } from "../utils/error.js"
import bcryptjs from "bcryptjs"

export const test = (req, res) => {
    res.send('hello')
}


export const updateUser = async (req, res, next) => {


    if (req.user._id !== req.params.id) {
        return next(errorHandler(401, "You can update only your account"))
    }

    try {
        if (req.body.email) {
            const isEmailExist = await User.findOne({ email: req.body.email });
            if (isEmailExist) return next(errorHandler(401, "Email already exist"));
        }

        if (req.body.password) {
            req.body.password = bcryptjs.hashSync(req.body.password, 10);
        }

        const { id } = req.params

        const updateUser = await User.findByIdAndUpdate(id, {
            $set: {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                profileImg: req.body.profileImg,
            }
        }, { new: true });

        const { password, ...userData } = updateUser._doc;

        res.status(200).json(userData);
    } catch (error) {
        next(error);
    }
}


export const deleteUser = async (req, res, next) => {
    if (req.user._id !== req.params.id) {
        return next(errorHandler(401, "You can delete only your account"))
    }
    try {
        const { id } = req.params;

        await User.findByIdAndDelete(id);

        res.clearCookie("cookie").status(200).json({
            message: "User deleted"
        })
    } catch (error) {
        next(error);
    }
}

export const logoutUser = async (req, res, next) => {
    try {
        res.clearCookie("cookie").status(200).json({
            message: "User logout"
        })
    } catch (error) {
        next(error);
    }
}

export const getUserListing = async (req, res, next) => {

    if (req.user._id !== req.params.id) {
        return next(errorHandler(401, "You can get only your listing"))
    }
    try {
        const listing = await Listing.find({ userRef: req.params.id })
        res.status(200).json(listing);
    } catch (error) {
        next(error)
        console.log(`Error while get User Listing : ${error}`)
    }
}

export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user) return next(errorHandler(404, "User Not Found"));

        const { password, ...userData } = user._doc;

        res.status(200).json(userData)
    } catch (error) {
        next(error)
    }
}