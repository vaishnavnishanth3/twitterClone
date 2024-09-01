import express from "express"
import dotenv from "dotenv"
import path from "path"
import { v2 as cloudinary} from "cloudinary"
import cors from "cors"
import dbConnection from "./db/connectMongoDB.js"
import authRoutes from "./routes/auth.route.js"
import userRoutes from "./routes/user.route.js"
import postRoutes from "./routes/post.route.js"
import notificationRoutes from "./routes/notification.route.js"
import cookieParser from "cookie-parser"

dotenv.config()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const app = express();
const port = process.env.PORT;
const __dirname = path.resolve()

app.use(express.json({limit:"5mb"})) //limit shouldn't be too high which may leed to DoS attacks
app.use(express.urlencoded({ extended: true })) //to parse form data
app.use(cors())
app.use(cookieParser())

app.use("/api/auth",authRoutes)
app.use("/api/users",userRoutes)
app.use("/api/posts",postRoutes)
app.use("/api/notifications",notificationRoutes)

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "/client/dist")));
    app.get("*", (req,res) => {
        res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"))
    })
}

app.listen(port, () => {
    console.log(`\nServer running on http://localhost:${port}`)
    dbConnection()
})