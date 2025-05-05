import mongoose from "mongoose";
import User from "../models/UserModel.js";
import Message from "../models/MessagesModel.js";

export const searchContacts = async (request, response, next) => {
    try {
        const { searchTerm } = request.body;

        if (searchTerm === undefined || searchTerm === null) {
            return response.status(400).send("searchTerm is required")
        }

        const sanitizedSearchTerm = searchTerm.replace( // for escaping special character
            /[.*+?^${}()|[\]\\]/g,
            "\\$&"
        )

        const regex = new RegExp(sanitizedSearchTerm, "i") // this is for case insensitive

        const contacts = await User.find({
            $and: [
                { _id: { $ne: request.userId } }, // for excluding loggedin user
                {
                    $or: [{ firstName: regex }, { lastName: regex }, { email: regex }],
                },
            ],
        })
        return response.status(200).send({ contacts })

    } catch (error) {
        console.log(error)
        response.status(500).send("Internal server error")
    }
}

export const getContactsForDMList = async (request, response, next) => {
    try {
        let { userId } = request;
        userId = new mongoose.Types.ObjectId(userId)

        const contacts = await Message.aggregate([
            {
                $match: {
                    $or: [{ sender: userId }, { recipient: userId }],
                },
            },
            {
                $sort: { timestamp: -1 },
            },
            {
                $group: {
                    _id: {
                        $cond: {
                            if: { $eq: ["$sender", userId] },
                            then: "$recipient",
                            else: "$sender",
                        }
                    },
                    lastMessageTime: { $first: "$timestamp" },
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "contactInfo",
                }
            },
            {
                $unwind: "$contactInfo",
            },
            {
                $project: {
                    _id: 1,
                    lastMessageTime: 1,
                    email: "$contactInfo.email",
                    firstName: "$contactInfo.firstName",
                    lastName: "$contactInfo.lastName",
                    image: "$contactInfo.image",
                    color: "$contactInfo.color"
                },
            },
            {
                $sort: { lastMessageTime: -1 },
            },
        ])


        return response.status(200).send({ contacts })

    } catch (error) {
        console.log(error)
        response.status(500).send("Internal server error")
    }
}