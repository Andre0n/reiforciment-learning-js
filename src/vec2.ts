class Vec2 {
  public x: number;
  public y: number;

  constructor(p_x: number, p_y: number) {
    this.x = p_x;
    this.y = p_y;
  }

  toArray(): number[] {
    return [this.x, this.y];
  }

  equals(other: Vec2): boolean {
    return this.x === other.x && this.y === other.y;
  }

  abs(): Vec2 {
    return new Vec2(Math.abs(this.x), Math.abs(this.y));
  }

  add(other: Vec2): Vec2 {
    return new Vec2(this.x + other.x, this.y + other.y);
  }

  sub(other: Vec2): Vec2 {
    return new Vec2(this.x - other.x, this.y - other.y);
  }

  set(x: number, y: number): void {
    this.x = x;
    this.y = y;
  }

  distanceTo(other: Vec2): number {
    return Math.sqrt((this.x - other.x) ** 2 + (this.y - other.y) ** 2);
  }
}

export default Vec2;
