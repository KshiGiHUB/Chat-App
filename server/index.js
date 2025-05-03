import express from "express"
import mongoose from "mongoose"
import cookieParser from "cookie-parser"
import cors from "cors"
import dotenv from "dotenv"
import authRoutes from "./routes/AuthRoutes.js"
import contactsRoute from "./routes/ContactRoutes.js"
import setUpSocket from "./socket.js"
import messageRoutes from "./routes/MessagesRoute.js"

dotenv.config()

const app = express()
const port = process.env.PORT || 3001
const databaseURL = process.env.DATABASE_URL

app.use(
    cors({
        origin: "http://localhost:5173",
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        credentials: true,
        allowedHeaders: ["Content-Type"]
    })
)

app.use(cookieParser())
app.use(express.json())

app.use("/api/auth", authRoutes)
app.use("/api/contacts", contactsRoute)
app.use("/api/messages", messageRoutes)

const server = app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`)
})

setUpSocket(server)

mongoose
    .connect(databaseURL)
    .then(() => console.log("database connected"))
    .catch(err => console.log(err.message))