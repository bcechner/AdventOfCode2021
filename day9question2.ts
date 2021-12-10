import { readFileSync } from "fs";

class Point {
  private _height: number;
  private _alreadyPartOfBasinCount: boolean = false;

  public get alreadyPartOfBasinCount(): boolean {
    return this._alreadyPartOfBasinCount;
  }

  public set alreadyPartOfBasinCount(value: boolean) {
    this._alreadyPartOfBasinCount = value;
  }

  public get height(): number {
    return this._height;
  }

  private set height(value: number) {
    this._height = value;
  }

  private _leftPoint: Point;

  public get left(): Point {
    return this._leftPoint;
  }

  public set left(value: Point) {
    this._leftPoint = value;
  }

  private _rightPoint: Point;

  public get right(): Point {
    return this._rightPoint;
  }

  public set right(value: Point) {
    this._rightPoint = value;
  }

  private _upPoint: Point;

  public get up(): Point {
    return this._upPoint;
  }

  public set up(value: Point) {
    this._upPoint = value;
  }

  private _downPoint: Point;

  public get down(): Point {
    return this._downPoint;
  }

  public set down(value: Point) {
    this._downPoint = value;
  }

  constructor(height: number) {
    this.height = height;
  }

  public isLowPoint() {
    return (
      (this.up === undefined || this.height < this.up.height) &&
      (this.down === undefined || this.height < this.down.height) &&
      (this.left === undefined || this.height < this.left.height) &&
      (this.right === undefined || this.height < this.right.height)
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
          point.up = this.getPoint(x, y - 1);
        }

        if (y + 1 < numberOfRows) {
          point.down = this.getPoint(x, y + 1);
        }

        if (x != 0) {
          point.left = this.getPoint(x - 1, y);
        }

        if (x + 1 < numberOfColumns) {
          point.right = this.getPoint(x + 1, y);
        }
      }
    }

    return this;
  }

  public findBasinSizes() {
    let basinSizes: number[] = [];

    for (let row of this.rows) {
      for (let point of row) {
        if (point.isLowPoint()) {
          basinSizes.push(this.findBasinSize(point));
          this.resetBasinCount();
        }
      }
    }

    return basinSizes;
  }

  private findBasinSize(point: Point) {
    point.alreadyPartOfBasinCount = true;
    let basinSize = 1;

    if (
      point.up &&
      !point.up.alreadyPartOfBasinCount &&
      point.up.height !== 9 &&
      point.up.height > point.height
    ) {
      basinSize += this.findBasinSize(point.up);
    }

    if (
      point.down &&
      !point.down.alreadyPartOfBasinCount &&
      point.down.height !== 9 &&
      point.down.height > point.height
    ) {
      basinSize += this.findBasinSize(point.down);
    }

    if (
      point.left &&
      !point.left.alreadyPartOfBasinCount &&
      point.left.height !== 9 &&
      point.left.height > point.height
    ) {
      basinSize += this.findBasinSize(point.left);
    }

    if (
      point.right &&
      !point.right.alreadyPartOfBasinCount &&
      point.right.height !== 9 &&
      point.right.height > point.height
    ) {
      basinSize += this.findBasinSize(point.right);
    }

    return basinSize;
  }

  private resetBasinCount() {
    for (let row of this.rows) {
      for (let point of row) {
        point.alreadyPartOfBasinCount = false;
      }
    }
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

const basinSizes = heightMap.buildMap().findBasinSizes();

const solution = basinSizes
  .sort((a, b) => b - a)
  .slice(0, 3)
  .reduce(
    (rollingProduct, currentBasinSize) => rollingProduct * currentBasinSize,
    1
  );

console.log(solution);
