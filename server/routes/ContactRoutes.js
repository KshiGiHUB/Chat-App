import { Router } from "express";
import { verifyToken } from "../middlewares/AuthMiddlewares.js"
import { getAllContacts, getContactsForDMList, searchContacts } from "../controllers/ContactsController.js"

const contactsRoute = Router();

contactsRoute.post('/search', verifyToken, searchContacts)
contactsRoute.get('/get-contacts-for-dm', verifyToken, getContactsForDMList)
contactsRoute.get('/get-all-contact', verifyToken, getAllContacts)
export default contactsRoute;