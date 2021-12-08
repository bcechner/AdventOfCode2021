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

  public isVerticalOrHorizontal() {
    return (
      this.startingPoint.y === this.endingPoint.y ||
      this.startingPoint.x === this.endingPoint.x
    );
  }

  public getPointsOnLine(): Point[] {
    if (!this.isVerticalOrHorizontal()) {
      throw new Error("Not implemented for diagonal lines");
    }

    const pointsOnLine: Point[] = [];

    if (this.startingPoint.x === this.endingPoint.x) {
      let [smallerPoint, biggerPoint] = this.orderBySize(
        this.startingPoint.y,
        this.endingPoint.y
      );

      for (let i = smallerPoint; i <= biggerPoint; i++) {
        pointsOnLine.push(new Point(this.startingPoint.x, i));
      }
    } else if (this.startingPoint.y === this.endingPoint.y) {
      let [smallerPoint, biggerPoint] = this.orderBySize(
        this.startingPoint.x,
        this.endingPoint.x
      );

      for (let i = smallerPoint; i <= biggerPoint; i++) {
        pointsOnLine.push(new Point(i, this.startingPoint.y));
      }
    }

    return pointsOnLine;
  }

  private orderBySize(coordinate1, coordinate2) {
    return coordinate1 < coordinate2
      ? [coordinate1, coordinate2]
      : [coordinate2, coordinate1];
  }
}

let inputs: string[];

const rawData = readFileSync("./day5inputs.txt", "utf8");

inputs = rawData.split("\r\n");

let lines: Line[] = [];

for (let input of inputs) {
  let [rawStartingPoint, rawEndingPoint] = input.split(" -> ");

  let [rawStartingPointXValue, rawStartingPointyValue] =
    rawStartingPoint.split(",");

  let [rawEndingPointXValue, rawEndingPointyValue] = rawEndingPoint.split(",");

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

let pointMap: Map<string, number> = new Map();

for (let line of lines.filter((l) => l.isVerticalOrHorizontal())) {
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
