const express = require('express')
const {Server} = require("socket.io") ;
const cors = require('cors')
const bodyParser = require('body-parser')
const router = require('./routes/router')
const helmet = require('helmet') ;
const app = express()
const server = require("http").createServer(app) ;
const session = require('express-session') ;

const io = new Server(server, {
    cors: {
        origin: "http//localhost:3000",
        credentials: true,
    },
}) ;

app.use(helmet()) ;

app.use(
    cors({
    origin: "http://localhost:3000",
    credentials: true,
    })
);

app.use(express.json()) ;

app.use(session({
    secret: 'awdjkawndkjawndawndjn',
    credentials: true,
    name: "sid",
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.ENVIRONMENT === "production",
        httpOnly: true,
        expires: 1000 * 60 * 60 * 24 * 7,
        sameSite: process.env.ENVIRONMENT === "production" ? "none" : "lax",
    }
}))

app.use("/", router) ; 

io.on("connect", (socket) => {}) ;

// Confirms connection to dev
app.listen(4000, ()=>{
    console.log("Server is now listening at port 4000");
}) ;
