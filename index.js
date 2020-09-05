const { default: SpaceshipUser } = require("./Utils/SpaceshipUser");

var app = require("express")();
var http = require("http").createServer(app);
var io = require("socket.io")(http, {
  path: "/",
  serveClient: true,
  // below are engine.IO options
  pingInterval: 10000,
  pingTimeout: 5000,
  cookie: false,
});

app.get("/", (req, res) => {
  // res.sendFile(__dirname + "/index.html");
  res.send("hello")
});

// app.listen(3000)

http.listen(4000, () => {
  console.log("listening on *:4000");
});

var sockets = [];

const EVENT_ENTER = "e"
const EVENT_EXIT = "x"
const EVENT_USER_LIST = "l"
const EVENT_USER_MOVE = "m"

io.on("connection", (socket) => {
  // console.log("Connect ID:", socket.id);

  socket.on(EVENT_ENTER, (id, name) => {
    // console.log(EVENT_ENTER, id)
    io.emit(EVENT_ENTER, id, name);
    socket.emit(
      EVENT_USER_LIST,
      sockets.map(({id, name, x, y}) => ({id, name, x, y}))
    );
    sockets.push( new SpaceshipUser(socket, name) );
  });

  socket.on("disconnect", (reason) => {
    // console.log("Exit", socket.id);
    io.emit(EVENT_EXIT, socket.id);
    const exitIndex = sockets.findIndex((each) => each.id === socket.id);
    sockets.splice(exitIndex, 1);
  });

  socket.on(EVENT_USER_MOVE, (x, y) => {
    const who = sockets.findIndex((each) => each.id === socket.id);
    if( who !== -1 ) sockets[who].setPosition(x,y)
    io.emit(EVENT_USER_MOVE, socket.id, x, y);
  });
});
