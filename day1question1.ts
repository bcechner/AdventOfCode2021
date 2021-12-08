import { readFileSync } from "fs";

let inputs: number[];

const rawData = readFileSync("./inputs.txt", "utf8");

inputs = rawData.split("\n").map(Number);

const numberOfIncreases = inputs.reduce(
  (partialReduction, currentValue, currentIndex, array) => {
    if (currentIndex === 0) {
      return partialReduction;
    }

    return currentValue > array[currentIndex - 1]
      ? partialReduction + 1
      : partialReduction;
  },
  0
);

console.log(numberOfIncreases);
