import { readFileSync } from "fs";

class TestableInput {
  value: string;
  meetsCriteria: boolean = true;

  constructor(value: string) {
    this.value = value;
  }

  test(bitIndex: number, expectedBitValue: number) {
    if (Number(this.value[bitIndex]) !== expectedBitValue) {
      this.meetsCriteria = false;
    }
  }
}

class BitCounter {
  private zeroCount: number = 0;
  private oneCount: number = 0;
  private favoredBitValue: 0 | 1;

  constructor(favoredBitValue: 0 | 1) {
    this.favoredBitValue = favoredBitValue;
  }

  public record(bitValue: number) {
    if (bitValue === 0) {
      this.zeroCount++;
    } else if (bitValue === 1) {
      this.oneCount++;
    }
  }

  public getMostCommonBit(): number {
    if (this.zeroCount === this.oneCount) {
      return this.favoredBitValue;
    }

    return this.zeroCount > this.oneCount ? 0 : 1;
  }

  public getLeastCommonBit(): number {
    if (this.zeroCount === this.oneCount) {
      return this.favoredBitValue;
    }

    return this.zeroCount < this.oneCount ? 0 : 1;
  }
}

function loadBitCounter(
  testableInputs: TestableInput[],
  indexOfBitToCount: number,
  favoredBitValue: 0 | 1
) {
  const bitCounter = new BitCounter(favoredBitValue);

  for (let input of testableInputs) {
    bitCounter.record(Number(input.value[indexOfBitToCount]));
  }

  return bitCounter;
}

function findOxygenGeneratorRating(
  rawInputs: string[],
  bitLengthOfInput: number
) {
  let testableInputs = rawInputs.map((i) => new TestableInput(i));

  let currentTestingBitIndex = 0;

  while (
    testableInputs.length !== 1 &&
    currentTestingBitIndex < bitLengthOfInput
  ) {
    let expectedBitValue = loadBitCounter(
      testableInputs,
      currentTestingBitIndex,
      1
    ).getMostCommonBit();

    testableInputs.forEach((testableInput) =>
      testableInput.test(currentTestingBitIndex, expectedBitValue)
    );

    // Inefficient; shouldn't have to iterate over this array twice.
    // Could move the test into the filter callback, but that feels weird
    // Probably should take a functional approach
    // Another option would be to make TestableInput fluent
    testableInputs = testableInputs.filter((i) => i.meetsCriteria);

    currentTestingBitIndex++;
  }

  if (testableInputs.length !== 1) {
    throw new Error("Was not able to discover a single rating value");
  }

  return testableInputs[0];
}

function findCo2ScrubberRating(rawInputs: string[], bitLengthOfInput: number) {
  let testableInputs = rawInputs.map((i) => new TestableInput(i));

  let currentTestingBitIndex = 0;

  while (
    testableInputs.length !== 1 &&
    currentTestingBitIndex < bitLengthOfInput
  ) {
    let expectedBitValue = loadBitCounter(
      testableInputs,
      currentTestingBitIndex,
      0
    ).getLeastCommonBit();

    testableInputs.forEach((testableInput) =>
      testableInput.test(currentTestingBitIndex, expectedBitValue)
    );

    testableInputs = testableInputs.filter((i) => i.meetsCriteria);

    currentTestingBitIndex++;
  }

  if (testableInputs.length !== 1) {
    throw new Error("Was not able to discover a single rating value");
  }

  return testableInputs[0];
}

let rawInputs: string[];

const rawData = readFileSync("./day3inputs.txt", "utf8");

rawInputs = rawData.split("\r\n");

const bitLengthOfInput = rawInputs[0].length;

const binaryOxygenGeneratorRating = findOxygenGeneratorRating(
  rawInputs,
  bitLengthOfInput
);

const binaryCo2ScrubberRating = findCo2ScrubberRating(
  rawInputs,
  bitLengthOfInput
);

const oxygenGeneratorRating = parseInt(binaryOxygenGeneratorRating.value, 2);
const co2ScrubberRating = parseInt(binaryCo2ScrubberRating.value, 2);

console.log(binaryOxygenGeneratorRating.value);
console.log(oxygenGeneratorRating);

console.log(binaryCo2ScrubberRating.value);
console.log(co2ScrubberRating);

console.log(oxygenGeneratorRating * co2ScrubberRating);
