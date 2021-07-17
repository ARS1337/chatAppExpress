const express = require("express");
const { read } = require("fs");
const app = express();
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true }));
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const userToSocketId ={}
const userList=[]

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/first.html");
});

app.post("/socket", (req, res) => {
  res.cookie("userName", req.body.name);
  res.sendFile(__dirname + "/index.html");
  console.log(req.body.name, "connected");
});

io.on("connection", (socket) => {
  socket.on("join", (data) => {
    userToSocketId[socket.id]=data.user;
    console.log(userToSocketId)
    io.emit("join", `${data.user} has joined`);
  });
  socket.on("chat message", (msg) => {
    io.emit("chat message", `${msg.user}:${msg.data}`);
    console.log("message: ", `${msg.user}:${msg.data}`);
  });
  socket.on("disconnect", () => {
    io.emit("userDisconnect", "a user disconnected");
    console.log("a user disconnected!");
  });
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});
