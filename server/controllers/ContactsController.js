import User from "../models/UserModel.js";

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