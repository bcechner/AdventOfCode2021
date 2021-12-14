import { readFileSync, writeFileSync } from "fs";

class Point {
  private _x: number;

  public get x(): number {
    return this._x;
  }

  public set x(value: number) {
    this._x = value;
  }

  private _y: number;

  public get y(): number {
    return this._y;
  }

  public set y(value: number) {
    this._y = value;
  }

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

class Paper {
  private _points: Point[];

  public get points(): Point[] {
    return this._points;
  }

  protected set points(value: Point[]) {
    this._points = value;
  }

  constructor(points: Point[]) {
    this.points = points;
  }

  public fold(direction: string, position: number) {
    const newPoints = [];

    switch (direction) {
      case "x": {
        for (let point of this.points) {
          if (point.x > position) {
            let reflectedXPosition = position - Math.abs(position - point.x);

            let existingReflectedPoint = this.points.find(
              (p) => p.x === reflectedXPosition && p.y === point.y
            );

            if (existingReflectedPoint === undefined) {
              newPoints.push(new Point(reflectedXPosition, point.y));
            }
          } else {
            newPoints.push(point);
          }
        }
        break;
      }
      case "y": {
        for (let point of this.points) {
          if (point.y > position) {
            let reflectedYPosition = position - Math.abs(position - point.y);

            let existingReflectedPoint = this.points.find(
              (p) => p.x === point.x && p.y === reflectedYPosition
            );

            if (existingReflectedPoint === undefined) {
              newPoints.push(new Point(point.x, reflectedYPosition));
            }
          } else {
            newPoints.push(point);
          }
        }
        break;
      }
      default: {
        throw new Error("Not implemented.");
      }
    }

    this.points = newPoints;
  }
}

let inputs: string[];

const rawData = readFileSync("./day13inputs.txt", "utf8");

inputs = rawData.split("\r\n");

let points = [];

let i = 0;

while (inputs[i] !== "") {
  let [x, y] = inputs[i].split(",");

  points.push(new Point(Number(x), Number(y)));

  i++;
}

const paper = new Paper(points);

i++;

for (; i < inputs.length; i++) {
  let [foldDirection, foldPosition] = inputs[i].split(" along ")[1].split("=");

  paper.fold(foldDirection, Number(foldPosition));
}

visualize(paper.points);

function visualize(points: Point[]) {
  let asciiChart = "";

  for (let i = 0; i < 1200; i++) {
    for (let j = 0; j < 1200; j++) {
      let point = points.find((p) => p.x === j && p.y === i);

      if (point === undefined) {
        asciiChart += " ";
      } else {
        asciiChart += "*";
      }
    }
    asciiChart += "\n";
  }

  writeFileSync("./day13output.txt", asciiChart);
}
