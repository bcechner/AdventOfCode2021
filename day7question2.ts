import { readFileSync } from "fs";

class Crab {
  private _position: number;

  public get position(): number {
    return this._position;
  }

  protected set position(value: number) {
    this._position = value;
  }

  constructor(position: number) {
    this.position = position;
  }
}

function nthTriangular(n: number) {
  return (n * (n + 1)) / 2;
}

let inputs: number[];

const rawData = readFileSync("./day7inputs.txt", "utf8");

inputs = rawData.split(",").map(Number);

const rangeMax = Math.max(...inputs);
const rangeMin = Math.min(...inputs);

let crabs = inputs.map((i) => new Crab(i));

let fuelConsumptionByPosition: Map<number, number> = new Map();

for (let i = rangeMin; i <= rangeMax; i++) {
  fuelConsumptionByPosition.set(
    i,
    crabs.reduce(
      (rollingFuelConsumption, currentCrab) =>
        rollingFuelConsumption +
        nthTriangular(Math.abs(currentCrab.position - i)),
      0
    )
  );
}

const positionWithMinimumFuelConsumption = Array.from(
  fuelConsumptionByPosition
).sort(([_a, a], [_b, b]) => a - b)[0];

const [position, fuelConsumption] = positionWithMinimumFuelConsumption;

console.log(`Position ${position} consumed minimum fuel ${fuelConsumption}`);
