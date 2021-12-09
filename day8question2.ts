import { readFileSync } from "fs";

class Display {
  private inputs: SegmentPattern[];
  private _outputs: SegmentPattern[];
  private mappings: Map<string, string>;

  public get outputs(): SegmentPattern[] {
    return this._outputs;
  }

  protected set outputs(value: SegmentPattern[]) {
    this._outputs = value;
  }

  constructor(input: string) {
    let [signalPatterns, digits] = input.split(" | ");

    this.inputs = signalPatterns.split(" ").map((s) => {
      const sortedPattern = s.split("");
      return new SegmentPattern(sortedPattern);
    });

    this.outputs = digits.split(" ").map((d) => {
      const sortedPattern = d.split("");
      return new SegmentPattern(sortedPattern);
    });

    this.mappings = new Map();
  }

  decode() {
    const one = this.inputs.find((s) => s.segments.length === 2);
    const four = this.inputs.find((s) => s.segments.length === 4);
    const seven = this.inputs.find((s) => s.segments.length === 3);
    const eight = this.inputs.find((s) => s.segments.length === 7);

    let remainingInputs = this.inputs.filter((i) => {
      return (
        i.asString !== one.asString &&
        i.asString !== four.asString &&
        i.asString !== seven.asString &&
        i.asString !== eight.asString
      );
    });

    // a is the difference between 1 and 7
    const a = seven.segments.filter((x) => !one.segments.includes(x))[0];

    // All segments (without 1, 4 and 7) have g and a
    const aOrG = eight.segments.filter((s) => {
      return remainingInputs.every(
        (remainingInput) => remainingInput.segments.indexOf(s) !== -1
      );
    });

    const g = aOrG.filter((s) => s !== a)[0];

    // 9 is 4 with a and g
    const nine = new SegmentPattern([...four.segments, a, g]);

    remainingInputs = remainingInputs.filter(
      (i) => i.asString !== nine.asString
    );

    // e is the difference between 8 and 9
    const e = eight.segments.filter((x) => !nine.segments.includes(x))[0];

    // 5 and 6 differ only by e (6 has the e)
    const six = remainingInputs.filter((remainingInput) =>
      remainingInputs.some(
        (cousinInput) =>
          remainingInput.asString !== cousinInput.asString &&
          remainingInput.asString ===
            new SegmentPattern([...cousinInput.segments, e]).asString
      )
    )[0];

    const five = new SegmentPattern(this.remove([...six.segments], e));

    remainingInputs = remainingInputs.filter(
      (i) => i.asString !== five.asString && i.asString !== six.asString
    );

    // c is the difference between 6 and 8
    const c = eight.segments.filter((x) => !six.segments.includes(x))[0];

    // 0 is the other input with 6 segments
    const zero = remainingInputs.filter(
      (remainingInput) =>
        remainingInput.asString !== six.asString &&
        remainingInput.asString !== nine.asString &&
        remainingInput.segments.length === 6
    )[0];

    remainingInputs = remainingInputs.filter(
      (i) => i.asString !== zero.asString
    );

    // d is the difference between 0 and 8
    const d = eight.segments.filter((x) => !zero.segments.includes(x))[0];

    // 2 is acdeg
    const two = new SegmentPattern([a, c, d, e, g]);

    remainingInputs = remainingInputs.filter(
      (i) => i.asString !== two.asString
    );

    // 3 is whatever remains
    const three = remainingInputs[0];

    this.mappings.set(zero.asString, "0");
    this.mappings.set(one.asString, "1");
    this.mappings.set(two.asString, "2");
    this.mappings.set(three.asString, "3");
    this.mappings.set(four.asString, "4");
    this.mappings.set(five.asString, "5");
    this.mappings.set(six.asString, "6");
    this.mappings.set(seven.asString, "7");
    this.mappings.set(eight.asString, "8");
    this.mappings.set(nine.asString, "9");
  }

  public readDisplay() {
    if (this.mappings.size === 0) {
      throw new Error("A display cannot be read until it is decoded.");
    }

    let decodedDisplay = "";

    for (let output of this.outputs) {
      decodedDisplay += this.mappings.get(output.asString);
    }

    return Number(decodedDisplay);
  }

  private remove(array: string[], element: string) {
    const elementIndex = array.indexOf(element);

    array.splice(elementIndex, 1);

    return array;
  }
}

class SegmentPattern {
  private _segments: string[];
  private _asString: string;

  public get asString(): string {
    return this._asString;
  }

  protected set asString(value: string) {
    this._asString = value;
  }

  public get segments(): string[] {
    return this._segments;
  }

  protected set segments(value: string[]) {
    this._segments = value;
  }

  constructor(segments: string[]) {
    this.segments = segments.sort();

    this._asString = this.segments.join("");
  }
}

let inputs: string[];

const rawData = readFileSync("./day8inputs.txt", "utf8");

inputs = rawData.split("\r\n");

const displays = inputs.map((i) => new Display(i));

let displayTotal = 0;

for (let display of displays) {
  display.decode();
  displayTotal += display.readDisplay();
}

console.log(displayTotal);
