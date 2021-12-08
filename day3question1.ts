// Could be done via bitmasking, arguably that would be easier, since dealing with indeces opens you up to offby1 issues
// I decided to deal in indeces, might refactor later (ha)

import { readFileSync } from "fs";

class BitCounter {
  private zeroCount: number = 0;
  private oneCount: number = 0;

  public record(bitValue: number) {
    if (bitValue === 0) {
      this.zeroCount++;
    } else if (bitValue === 1) {
      this.oneCount++;
    }
  }

  public getMostCommonBit(): number {
    this.verifyUnevenFrequency();

    return this.zeroCount > this.oneCount ? 0 : 1;
  }

  public getLeastCommonBit(): number {
    this.verifyUnevenFrequency();

    return this.zeroCount < this.oneCount ? 0 : 1;
  }

  private verifyUnevenFrequency() {
    if (this.zeroCount === this.oneCount) {
      throw new Error(
        "Neither bit value is more common, both have: " + this.zeroCount
      );
    }
  }
}

let inputs: string[];

const rawData = readFileSync("./day3inputs.txt", "utf8");

inputs = rawData.split("\r\n");

const bitLengthOfInput = inputs[0].length;

const bitCounters: BitCounter[] = [];

for (let i = 0; i < bitLengthOfInput; i++) {
  bitCounters.push(new BitCounter());
}

for (let input of inputs) {
  input.split("").forEach((bitValue, bitIndex) => {
    bitCounters[bitIndex].record(Number(bitValue));
  });
}

const binaryGammaRate = bitCounters.reduce<string>(
  (partialReduction, currentBitCounter) => {
    return partialReduction + String(currentBitCounter.getMostCommonBit());
  },
  ""
);

const binaryEpsilonRate = bitCounters.reduce<string>(
  (partialReduction, currentBitCounter) => {
    return partialReduction + String(currentBitCounter.getLeastCommonBit());
  },
  ""
);

const gammaRate = parseInt(binaryGammaRate, 2);
const epsilonRate = parseInt(binaryEpsilonRate, 2);

console.log(gammaRate);
console.log(epsilonRate);
console.log(gammaRate * epsilonRate);
