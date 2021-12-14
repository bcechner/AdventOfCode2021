class PairInsertionRule {
  private pair: string;
  private _insertedCharacter: string;

  public get insertedCharacter(): string {
    return this._insertedCharacter;
  }

  private set insertedCharacter(value: string) {
    this._insertedCharacter = value;
  }

  constructor(pair: string, insertedCharacter: string) {
    this.pair = pair;
    this.insertedCharacter = insertedCharacter;
  }

  public applies(pair: string) {
    return this.pair === pair;
  }
}

class PolymerProcessor {
  private insertionRules: PairInsertionRule[];

  constructor(insertionRules: PairInsertionRule[]) {
    this.insertionRules = insertionRules;
  }

  public process(template: string) {
    let generatedTemplate = "";

    for (let i = 0; i < template.length - 1; i++) {
      let pair = template.slice(i, i + 2);

      let insertionRule = this.insertionRules.find((r) => r.applies(pair));

      if (insertionRule !== undefined) {
        generatedTemplate += pair[0] + insertionRule.insertedCharacter;
      }
    }

    return generatedTemplate + template[template.length - 1];
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

let processor = new PolymerProcessor(insertionRules);

const steps = 40;

let mutatedTemplate = template;

for (let i = 0; i < steps; i++) {
  mutatedTemplate = processor.process(mutatedTemplate);
}

const elements = new Set(mutatedTemplate);
const elementFrequency = new Map();

for (let element of Array.from(elements)) {
  elementFrequency.set(
    element,
    mutatedTemplate.split("").filter((e) => e === element).length
  );
}

const orderedFrequencies = Array.from(elementFrequency.values()).sort(
  (a, b) => b - a
);

console.log(
  orderedFrequencies[0] - orderedFrequencies[orderedFrequencies.length - 1]
);
