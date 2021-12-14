class PairInsertionRule {
  private pair: string;
  private _insertedCharacter: string;

  public get insertedElement(): string {
    return this._insertedCharacter;
  }

  private set insertedElement(value: string) {
    this._insertedCharacter = value;
  }

  constructor(pair: string, insertedCharacter: string) {
    this.pair = pair;
    this.insertedElement = insertedCharacter;
  }

  public applies(pair: string) {
    return this.pair === pair;
  }
}

class FrequencyTracker {
  private pairFrequency: Map<string, number>;
  private _elementFrequency: Map<string, number>;

  public get elementFrequency(): Map<string, number> {
    return this._elementFrequency;
  }

  private set elementFrequency(value: Map<string, number>) {
    this._elementFrequency = value;
  }

  constructor(template: string) {
    this.pairFrequency = this.buildInitialPairFrequency(template);
    this.elementFrequency = this.buildInitialElementFrequency(template);
  }

  public resetPairFrequency() {
    const existingPairFrequency = this.pairFrequency;

    this.pairFrequency = new Map();

    return existingPairFrequency;
  }

  private buildInitialPairFrequency(template: string) {
    const pairFrequency = new Map();

    for (let i = 0; i < template.length - 1; i++) {
      let pair = template.slice(i, i + 2);

      pairFrequency.set(
        pair,
        pairFrequency.has(pair) ? pairFrequency.get(pair) + 1 : 1
      );
    }

    return pairFrequency;
  }

  private buildInitialElementFrequency(template: string) {
    const elementFrequency = new Map();

    for (let element of template) {
      elementFrequency.set(
        element,
        elementFrequency.has(element) ? elementFrequency.get(element) + 1 : 1
      );
    }

    return elementFrequency;
  }

  public increasePairFrequency(pair: string, numberOfNewPairs: number) {
    this.pairFrequency.set(
      pair,
      this.pairFrequency.has(pair)
        ? this.pairFrequency.get(pair) + numberOfNewPairs
        : numberOfNewPairs
    );
  }

  public increaseElementFrequency(
    element: string,
    numberOfNewElements: number
  ) {
    this.elementFrequency.set(
      element,
      this.elementFrequency.has(element)
        ? this.elementFrequency.get(element) + numberOfNewElements
        : 1
    );
  }
}

class PolymerProcessor {
  private insertionRules: PairInsertionRule[];
  private frequencyTracker: FrequencyTracker;

  constructor(insertionRules: PairInsertionRule[], template: string) {
    this.insertionRules = insertionRules;
    this.frequencyTracker = new FrequencyTracker(template);
  }

  public mutate() {
    this.frequencyTracker.resetPairFrequency().forEach((frequency, pair) => {
      let applicableRule = this.insertionRules.find((r) => r.applies(pair));

      if (applicableRule === undefined) {
        throw new Error("Found no rule to process pair: " + pair);
      }

      this.frequencyTracker.increaseElementFrequency(
        applicableRule.insertedElement,
        frequency
      );

      this.frequencyTracker.increasePairFrequency(
        pair[0] + applicableRule.insertedElement,
        frequency
      );

      this.frequencyTracker.increasePairFrequency(
        applicableRule.insertedElement + pair[1],
        frequency
      );
    }, this);
  }

  public getElementFrequencies() {
    return this.frequencyTracker.elementFrequency;
  }
}

import { readFileSync } from "fs";

let inputs: string[];

const rawData = readFileSync("./day14inputs.txt", "utf8");

inputs = rawData.split("\r\n").filter((i) => i !== "");

let template = inputs.shift();

let insertionRules = inputs.map((i) => {
  let [pair, insertionCharacter] = i.split(" -> ");

  return new PairInsertionRule(pair, insertionCharacter);
});

let processor = new PolymerProcessor(insertionRules, template);

const steps = 40;

for (let i = 0; i < steps; i++) {
  processor.mutate();
}

const orderedFrequencies = Array.from(
  processor.getElementFrequencies().values()
).sort((a, b) => b - a);

console.log(
  orderedFrequencies[0] - orderedFrequencies[orderedFrequencies.length - 1]
);
