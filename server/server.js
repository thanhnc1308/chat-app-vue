var express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
var path = require("path");
var favicon = require("serve-favicon");
var logger = require("morgan");
var bodyParser = require("body-parser");
var cors = require('cors');

// app.use(cors());
//enables cors
app.use(cors({
	'allowedHeaders': ['sessionId', 'Content-Type'],
	'exposedHeaders': ['sessionId'],
	'origin': '*',
	'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
	'preflightContinue': false
  }));
var room = require("./routes/room");
var chat = require("./routes/chat");

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: "false" }));
app.use(express.static(path.join(__dirname, "dist")));
app.use("/rooms", express.static(path.join(__dirname, "dist")));
app.use("/api/room", room);
app.use("/api/chat", chat);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

let users = [];
let messages = [];

// mongodb
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/chatapp");

// const ChatSchema = mongoose.Schema({
//   username: String,
//   msg: String
// });

// const ChatModel = mongoose.model("chat", ChatSchema);

// ChatModel.find((err, result) => {
//   if (err) throw err;

//   messages = result;
// });

// io.on("connection", socket => {
//   socket.emit("loggedIn", {
//     users: users.map(s => s.username),
//     messages: messages
//   });

//   socket.on("newuser", username => {
//     console.log(`${username} has arrived at the party.`);
//     socket.username = username;

//     users.push(socket);

//     io.emit("userOnline", socket.username);
//   });

//   socket.on("msg", msg => {
//     let message = new ChatModel({
//       username: socket.username,
//       msg: msg
//     });

//     message.save((err, result) => {
//       if (err) throw err;

//       messages.push(result);

//       io.emit("msg", result);
//     });
//   });

//   // Disconnect
//   socket.on("disconnect", () => {
//     console.log(`${socket.username} has left the party.`);
//     io.emit("userLeft", socket.username);
//     users.splice(users.indexOf(socket), 1);
//   });
// });

http.listen(process.env.PORT || 3000, () => {
  console.log("Listening on port %s", process.env.PORT || 3000);
});
