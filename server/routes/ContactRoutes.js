import { Router } from "express";
import { verifyToken } from "../middlewares/AuthMiddlewares.js"
import { searchContacts } from "../controllers/ContactsController.js"

const contactsRoute = Router();

contactsRoute.post('/search', verifyToken, searchContacts)

export default contactsRoute;