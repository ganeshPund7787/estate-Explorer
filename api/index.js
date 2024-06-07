import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv"
dotenv.config();
import userRouter from "./routes/user.routes.js"
import authRouter from "./routes/auth.route.js"
import listingRouter from "./routes/listing.route.js"
import cookieParser from "cookie-parser";
import path from "path"

mongoose.connect(process.env.MONGO_URI, { dbName: "estateExplorer" })
    .then(() => console.log(`MongoDb connected `))
    .catch((error) => console.log(`Error while mongoDB : ${error}`))

const __dirname = path.resolve();

const app = express();
app.use(cookieParser())
app.use(express.json())

app.listen(3000, () => {
    console.log(`The port is running on 3000!`)
});


app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/listing", listingRouter);

app.use(express.static(path.join(__dirname, '/client/dist')));

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal server error"
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
});

// mv .git ../ => for Git move repository to parent folder