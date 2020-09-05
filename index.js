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
  res.sendFile(__dirname + "/index.html");
});

http.listen(4000, () => {
  console.log("listening on *:4000");
});

var sockets = []

io.on("connection", (socket) => {
  console.log("Connect ID:", socket.id);

  socket.on("enter", (id) => {
    console.log("Enter", id);
    io.emit("enter", id);
    socket.emit('user-list', sockets.map(each => each.id))
    sockets.push( socket )
  });

  socket.on("disconnect", (reason) => {
    console.log("Exit", socket.id);
    io.emit("exit", socket.id);
    const exitIndex = sockets.findIndex( each => each.id === socket.id )
    sockets.splice( exitIndex, 1 )
  });

  socket.on("user-move", (x, y) => {
    io.emit("user-move", socket.id, x, y)
  })
});
