import express from "express"
import dotenv from "dotenv"
import connectDB from "./db/index.js"
import bodyParser from "body-parser"
import session from "express-session"
import { Server }  from "socket.io"
import http from 'http';
import { Userregister } from "./controllers/userController.js"


dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const server = http.createServer(app);
const io = new Server(server);




// routes Import
import userRouter from './routes/userRoutes.js'

//routes declaration
app.use("/api/users", userRouter);

// Socket.IO connection
io.on('connection', (socket) => {
    console.log('New client connected');
    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
});

// Middleware

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true,
}));

//app.set('view engine', 'ejs');

connectDB()
.then(() => {
    app.listen(process.env.PORT || 8085, () => {
        console.log(` Server is running at port : ${process.env.PORT}`);
    })
})
.catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
})

export { app }


// MONGODB_URI=mongodb+srv://sonu40004kumar:beR8OzqS7Aojs78L@kumar.jhtnkkg.mongodb.net/
// beR8OzqS7Aojs78L
// sonu40004kumar