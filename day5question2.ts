import { readFileSync } from "fs";

class Point {
  private _x: number;

  public get x(): number {
    return this._x;
  }

  protected set x(value: number) {
    this._x = value;
  }

  private _y: number;

  public get y(): number {
    return this._y;
  }

  protected set y(value: number) {
    this._y = value;
  }

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public encode() {
    return `${this.x},${this.y}`;
  }
}

class Line {
  protected startingPoint: Point;
  protected endingPoint: Point;

  constructor(startingPoint: Point, endingPoint: Point) {
    this.startingPoint = startingPoint;
    this.endingPoint = endingPoint;
  }

  public canDetermineIntermediatePoints() {
    return this.isHorizontal() || this.isVertical() || this.isDiagonal();
  }

  public getPointsOnLine(): Point[] {
    if (!this.canDetermineIntermediatePoints()) {
      throw new Error("Not implemented for this type of line");
    }

    const pointsOnLine: Point[] = [];

    if (this.isVertical()) {
      const yPolarity = Math.sign(this.endingPoint.y - this.startingPoint.y);

      for (
        let i = 0;
        i <= Math.abs(this.endingPoint.y - this.startingPoint.y);
        i++
      ) {
        pointsOnLine.push(
          new Point(this.startingPoint.x, this.startingPoint.y + i * yPolarity)
        );
      }
    } else if (this.isHorizontal()) {
      const xPolarity = Math.sign(this.endingPoint.x - this.startingPoint.x);

      for (
        let i = 0;
        i <= Math.abs(this.endingPoint.x - this.startingPoint.x);
        i++
      ) {
        pointsOnLine.push(
          new Point(this.startingPoint.x + i * xPolarity, this.startingPoint.y)
        );
      }
    } else if (this.isDiagonal()) {
      const xPolarity = Math.sign(this.endingPoint.x - this.startingPoint.x);
      const yPolarity = Math.sign(this.endingPoint.y - this.startingPoint.y);

      for (
        let i = 0;
        i <= Math.abs(this.endingPoint.x - this.startingPoint.x);
        i++
      ) {
        pointsOnLine.push(
          new Point(
            this.startingPoint.x + i * xPolarity,
            this.startingPoint.y + i * yPolarity
          )
        );
      }
    }

    return pointsOnLine;
  }

  private isVertical() {
    return this.startingPoint.x === this.endingPoint.x;
  }

  private isHorizontal() {
    return this.startingPoint.y === this.endingPoint.y;
  }

  private isDiagonal() {
    return (
      Math.abs(this.endingPoint.x - this.startingPoint.x) ===
      Math.abs(this.endingPoint.y - this.startingPoint.y)
    );
  }
}

let inputs: string[];

const rawData = readFileSync("./day5inputs.txt", "utf8");

inputs = rawData.split("\r\n");

let lines = buildLines(inputs);

let pointMap: Map<string, number> = new Map();

for (let line of lines.filter((l) => l.canDetermineIntermediatePoints())) {
  for (let point of line.getPointsOnLine()) {
    let encodedPoint = point.encode();

    pointMap.set(
      encodedPoint,
      pointMap.has(encodedPoint) ? pointMap.get(encodedPoint) + 1 : 1
    );
  }
}

const result = Array.from(pointMap.values()).filter((v) => v >= 2).length;

console.log(result);

function buildLines(inputs: string[]) {
  let lines: Line[] = [];

  for (let input of inputs) {
    let [rawStartingPoint, rawEndingPoint] = input.split(" -> ");

    let [rawStartingPointXValue, rawStartingPointyValue] =
      rawStartingPoint.split(",");

    let [rawEndingPointXValue, rawEndingPointyValue] =
      rawEndingPoint.split(",");

    let startingPoint = new Point(
      Number(rawStartingPointXValue),
      Number(rawStartingPointyValue)
    );

    let endingPoint = new Point(
      Number(rawEndingPointXValue),
      Number(rawEndingPointyValue)
    );

    lines.push(new Line(startingPoint, endingPoint));
  }

  return lines;
}
