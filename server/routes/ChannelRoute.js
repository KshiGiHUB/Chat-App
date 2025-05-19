import { Router } from "express";
import { verifyToken } from "../middlewares/AuthMiddlewares.js"
import { createChannel, getChannel, getChannelMessages } from "../controllers/ChannelController.js";

const channelRoutes = Router();

channelRoutes.post('/create-channel', verifyToken, createChannel)
channelRoutes.get('/get-channel', verifyToken, getChannel)
channelRoutes.get('/get-channel-messages/:channelId', verifyToken, getChannelMessages)

export default channelRoutes;