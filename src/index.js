import express from "express"
import dotenv from "dotenv"
import connectDB from "./db/index.js";

dotenv.config({
    path: './.env'
})

const app = express()

app.use(express.json());

connectDB()


.then(() => {
    app.listen(process.env.PORT || 8085, () => {
        console.log(` Server is running at port : ${process.env.PORT}`);
    })
})
.catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
})
