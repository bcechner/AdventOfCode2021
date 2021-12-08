import { readFileSync } from "fs";

let inputs: number[];

const rawData = readFileSync("./day1inputs.txt", "utf8");

inputs = rawData.split("\n").map(Number);

const windowedInputs = inputs.reduce<number[]>(
  (partialReduction, currentValue, currentIndex, array): number[] => {
    if (currentIndex + 2 >= array.length) {
      return partialReduction;
    }

    partialReduction.push(
      currentValue + array[currentIndex + 1] + array[currentIndex + 2]
    );

    return partialReduction;
  },
  []
);

const numberOfIncreases = windowedInputs.reduce(
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
