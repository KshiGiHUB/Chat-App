import Message from "../models/MessagesModel.js"

export const getMessages = async (request, response, next) => {
    try {
        const user1 = request.userId
        const user2 = request.body.id

        if (!user1 || !user1) {
            return response.status(400).send("Both user Ids are required.")
        }

        const messages = await Message.find({
            $or: [
                { sender: user1, recipient: user2 },
                { sender: user2, recipient: user1 },
            ],
        }).sort({ timestamp: 1 })
        return response.status(200).send({ messages })

    } catch (error) {
        console.log(error)
        response.status(500).send("Internal server error")
    }
}