function SpaceshipUser(socket, name) {
  this.socket = socket
  this.id = socket.id
  this.name = name
  this.x = 0
  this.y = 0
  this.setPosition = (x, y) => {
    this.x = x;
    this.y = y;
    return this
  }
  this.clone = () => {
    return {
      ...this
    }
  }
}

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = SpaceshipUser;
exports.default = _default;
