import { Router } from "express";
import { verifyToken } from "../middlewares/AuthMiddlewares.js"
import { getContactsForDMList, searchContacts } from "../controllers/ContactsController.js"

const contactsRoute = Router();

contactsRoute.post('/search', verifyToken, searchContacts)
contactsRoute.get('/get-contacts=for-dm', verifyToken, getContactsForDMList)

export default contactsRoute;