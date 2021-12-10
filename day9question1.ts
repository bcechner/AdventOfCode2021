import { readFileSync } from "fs";

class Point {
  private _height: number;

  public get height(): number {
    return this._height;
  }

  private set height(value: number) {
    this._height = value;
  }

  private _leftPoint: Point;

  public get leftPoint(): Point {
    return this._leftPoint;
  }

  public set leftPoint(value: Point) {
    this._leftPoint = value;
  }

  private _rightPoint: Point;

  public get rightPoint(): Point {
    return this._rightPoint;
  }

  public set rightPoint(value: Point) {
    this._rightPoint = value;
  }

  private _upPoint: Point;

  public get upPoint(): Point {
    return this._upPoint;
  }

  public set upPoint(value: Point) {
    this._upPoint = value;
  }

  private _downPoint: Point;

  public get downPoint(): Point {
    return this._downPoint;
  }

  public set downPoint(value: Point) {
    this._downPoint = value;
  }

  constructor(height: number) {
    this.height = height;
  }

  public isLowPoint() {
    return (
      (this.upPoint === undefined || this.height < this.upPoint.height) &&
      (this.downPoint === undefined || this.height < this.downPoint.height) &&
      (this.leftPoint === undefined || this.height < this.leftPoint.height) &&
      (this.rightPoint === undefined || this.height < this.rightPoint.height)
    );
  }

  public getRiskLevel() {
    return this.height + 1;
  }
}

class HeightMap {
  private rows: Point[][] = [];

  public addRow(rowInput: string) {
    this.rows.push(rowInput.split("").map((i) => new Point(Number(i))));
  }

  public buildMap(): this {
    const numberOfColumns = this.rows[0].length;
    const numberOfRows = this.rows.length;

    for (let y = 0; y < numberOfRows; y++) {
      for (let x = 0; x < numberOfColumns; x++) {
        let point = this.getPoint(x, y);

        if (y != 0) {
          point.upPoint = this.getPoint(x, y - 1);
        }

        if (y + 1 < numberOfRows) {
          point.downPoint = this.getPoint(x, y + 1);
        }

        if (x != 0) {
          point.leftPoint = this.getPoint(x - 1, y);
        }

        if (x + 1 < numberOfColumns) {
          point.rightPoint = this.getPoint(x + 1, y);
        }
      }
    }

    return this;
  }

  public getLowPoints() {
    let lowPoints: Point[] = [];

    for (let row of this.rows) {
      for (let point of row) {
        if (point.isLowPoint()) {
          lowPoints.push(point);
        }
      }
    }

    return lowPoints;
  }

  public getPoint(x, y) {
    return this.rows[y][x];
  }
}

let inputRows: string[];

const rawData = readFileSync("./day9inputs.txt", "utf8");

inputRows = rawData.split("\r\n");

const heightMap = new HeightMap();

for (let row of inputRows) {
  heightMap.addRow(row);
}

const lowPoints = heightMap.buildMap().getLowPoints();

const sumOfRiskLevels = lowPoints.reduce(
  (rollingSum, currentPoint) => rollingSum + currentPoint.getRiskLevel(),
  0
);

console.log(sumOfRiskLevels);
