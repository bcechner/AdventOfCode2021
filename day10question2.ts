import { readFileSync } from "fs";

const openingCharacters = ["(", "[", "{", "<"];

const characterMap = new Map<string, string>([
  [")", "("],
  ["]", "["],
  ["}", "{"],
  [">", "<"],
]);

const scoreMap = new Map<string, number>([
  ["(", 1],
  ["[", 2],
  ["{", 3],
  ["<", 4],
]);

class ChunkLine {
  private _lineCharacters: string[];

  public get lineCharacters(): string[] {
    return this._lineCharacters;
  }

  private set lineCharacters(value: string[]) {
    this._lineCharacters = value;
  }

  constructor(line: string) {
    this.lineCharacters = line.split("");
  }

  public score() {
    let openingStack: string[] = [];

    for (let character of this.lineCharacters) {
      if (openingCharacters.some((c) => c === character)) {
        openingStack.push(character);
      } else {
        let matchingCharacter = characterMap.get(character);

        if (matchingCharacter !== openingStack.pop()) {
          return 0;
        }
      }
    }

    return openingStack
      .reverse()
      .reduce(
        (rollingReduction, currentCharacter) =>
          rollingReduction * 5 + scoreMap.get(currentCharacter),
        0
      );
  }
}

let inputs: string[];

const rawData = readFileSync("./day10inputs.txt", "utf8");

inputs = rawData.split("\r\n");

let chunkLines = inputs.map((i) => new ChunkLine(i));

let completionScores: number[] = [];

for (let chunkLine of chunkLines) {
  let completionScore = chunkLine.score();

  if (completionScore !== 0) {
    completionScores.push(completionScore);
  }
}

console.log(
  completionScores.sort((a, b) => a - b)[
    Math.floor(completionScores.length / 2)
  ]
);
