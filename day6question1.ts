import { readFileSync } from "fs";

class LanternFish {
  private daysTillReproduction: number;

  constructor(daysTillReproduction: number) {
    this.daysTillReproduction = daysTillReproduction;
  }

  public age() {
    this.daysTillReproduction--;
  }

  public shouldReproduce() {
    return this.daysTillReproduction < 0;
  }

  public reproduce() {
    this.daysTillReproduction = 6;

    return new LanternFish(8);
  }
}

let inputs: string[];

const rawData = readFileSync("./day6inputs.txt", "utf8");

inputs = rawData.split(",");

let lanternFish = inputs.map((i) => new LanternFish(Number(i)));

const daysToSimulate = 8; 

for (let i = 0; i < daysToSimulate; i++) {
  let newLanternfish: LanternFish[] = [];

  for (let fish of lanternFish) {
    fish.age();

    if (fish.shouldReproduce()) {
      newLanternfish.push(fish.reproduce());
    }
  }

  lanternFish = lanternFish.concat(newLanternfish);

  newLanternfish.length = 0;
}

console.log(lanternFish.length);
