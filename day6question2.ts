// Big idea is to optimize by grouping each reproductive tier.
// That way, the size of the tier array is constrained

import { readFileSync } from "fs";

const bornReproductionTime = 8;
const birthingReproductionTime = 6;

class LanternFishReproductiveTier {
  private _daysTillReproduction: number;

  public get daysTillReproduction(): number {
    return this._daysTillReproduction;
  }

  private set daysTillReproduction(value: number) {
    this._daysTillReproduction = value;
  }

  private _numberOfFish: number;

  public get numberOfFish(): number {
    return this._numberOfFish;
  }

  protected set numberOfFish(value: number) {
    this._numberOfFish = value;
  }

  constructor(daysTillReproduction: number, numberOfFish: number) {
    this.daysTillReproduction = daysTillReproduction;
    this.numberOfFish = numberOfFish;
  }

  public age() {
    this.daysTillReproduction--;
  }

  public shouldReproduce() {
    return this.daysTillReproduction < 0;
  }

  public reproduce() {
    this.daysTillReproduction = birthingReproductionTime;

    return this.numberOfFish;
  }

  public increaseTier(numberOfNewFish: number) {
    this.numberOfFish += numberOfNewFish;
  }
}

let inputs: number[];

const rawData = readFileSync("./day6inputs.txt", "utf8");

inputs = rawData.split(",").map((i) => Number(i));

let lanternFishReproductiveTiers = buildInitialTiers(inputs);

let fishTotal = 0;

const daysToSimulate = 256;

for (let i = 0; i < daysToSimulate; i++) {
  let newTier: LanternFishReproductiveTier = new LanternFishReproductiveTier(
    bornReproductionTime,
    0
  );

  for (let tier of lanternFishReproductiveTiers) {
    tier.age();

    if (tier.shouldReproduce()) {
      newTier.increaseTier(tier.reproduce());
    }
  }

  if (newTier.numberOfFish !== 0) {
    lanternFishReproductiveTiers.push(newTier);
  }

  lanternFishReproductiveTiers = compressReproductiveTiers(
    lanternFishReproductiveTiers
  );
}

fishTotal += lanternFishReproductiveTiers.reduce(
  (rollingFishTotal, currentTier) => {
    return rollingFishTotal + currentTier.numberOfFish;
  },
  0
);

console.log(fishTotal);

function buildInitialTiers(inputs: number[]) {
  let initialLanternFishReduction = inputs.reduce<Map<number, number>>(
    (latestReduction, currentValue) => {
      let input = currentValue;

      latestReduction.set(
        input,
        latestReduction.has(input) ? latestReduction.get(input) + 1 : 1
      );

      return latestReduction;
    },
    new Map<number, number>()
  );

  return Array.from(initialLanternFishReduction).map(
    ([generationNumber, numberOfFish]) =>
      new LanternFishReproductiveTier(generationNumber, numberOfFish)
  );
}

function compressReproductiveTiers(
  lanternFishReproductiveTiers: LanternFishReproductiveTier[]
) {
  let compressedTiers = [];

  for (let i = 0; i <= bornReproductionTime; i++) {
    let tierDuplicates = lanternFishReproductiveTiers.filter(
      (t) => t.daysTillReproduction === i
    );

    switch (tierDuplicates.length) {
      case 0: {
        break;
      }
      case 1: {
        compressedTiers.push(tierDuplicates[0]);
        break;
      }
      default: {
        let compressedTierFishCount = tierDuplicates.reduce(
          (rollingFishTotal, currentTierDuplicate) => {
            return rollingFishTotal + currentTierDuplicate.numberOfFish;
          },
          0
        );

        compressedTiers.push(
          new LanternFishReproductiveTier(i, compressedTierFishCount)
        );
      }
    }
  }

  return compressedTiers;
}
