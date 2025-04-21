import { compare } from "bcrypt";
import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";

const maxAge = 3 * 24 * 60 * 60 * 100;

const createToken = (email, userId) => {
    return jwt.sign({ email, userId }, process.env.JWT_KEY, { expiresIn: maxAge })
}

export const signup = async (request, response, next) => {
    try {
        const { email, password } = request.body;
        if (!email || !password) {
            return response.status(400).send("Email and password is required")
        }

        const user = await User.create({ email, password });
        response.cookie("jwt", createToken(email, user.id), {
            maxAge,
            secure: true,
            sameSite: "None",
        })
        return response.status(201).json({
            user: {
                id: user.id,
                email: user.email,
                // firstName: user.firstName,
                // lastName: user.lastName,
                // image: user.image,
                profileSetup: user.profileSetup
            }
        })
    } catch (error) {
        console.log(error)
        response.status(500).send("Internal server error")
    }
}

export const login = async (request, response, next) => {
    try {
        const { email, password } = request.body;
        if (!email || !password) {
            return response.status(400).send("Email and password is required")
        }

        const user = await User.findOne({ email });
        if (!user) {
            return response.status(404).send("User not found")
        }

        const auth = await compare(password, user.password)

        if (!auth) {
            return response.status(404).send("Password is incorrect")
        }

        response.cookie("jwt", createToken(email, user.id), {
            maxAge,
            secure: true,
            sameSite: "None",
        })
        return response.status(200).json({
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                image: user.image,
                profileSetup: user.profileSetup,
                color: user.color
            }
        })
    } catch (error) {
        console.log(error)
        response.status(500).send("Internal server error")
    }
}


export const getUserInfo = async (request, response, next) => {

    try {


        const user = await User.findById(request.userId);
        if (!user) {
            return response.status(404).send("User with the given id is not found")
        }
        return response.status(200).json({
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                image: user.image,
                profileSetup: user.profileSetup,
                color: user.color
            }
        })
    } catch (error) {
        console.log(error)
        response.status(500).send("Internal server error")
    }
}

export const updateProfile = async (request, response, next) => {
    try {

        const { userId } = request;
        const { firstName, lastName, color } = request.body;

        if (!firstName || !lastName) {
            return response.status(400).send("firstName, lastName is required")
        }

        const user = await User.findByIdAndUpdate(userId, { firstName, lastName, color, profileSetup: true },
            { new: true, runValidators: true }
        );

        return response.status(200).json({
            user: {
                id: userId,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                image: user.image,
                profileSetup: user.profileSetup,
                color: user.color
            }
        })
    } catch (error) {
        console.log(error)
        response.status(500).send("Internal server error")
    }
}