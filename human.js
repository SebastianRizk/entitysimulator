export default class Human {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  move(x, y) {
    this.x += x;
    this.y += y;
  }

  getX() {
    return this.x;
  }

  getY() {
    return this.y;
  }
}
