import { readFileSync } from "fs";

const openingCharacters = ["(", "[", "{", "<"];

const characterMap = new Map<string, string>([
  [")", "("],
  ["]", "["],
  ["}", "{"],
  [">", "<"],
]);

const scoreMap = new Map<string, number>([
  [")", 3],
  ["]", 57],
  ["}", 1197],
  [">", 25137],
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
    let openingStack = [];

    for (let character of this.lineCharacters) {
      if (openingCharacters.some((c) => c === character)) {
        openingStack.push(character);
      } else {
        let matchingCharacter = characterMap.get(character);

        if (matchingCharacter !== openingStack.pop()) {
          return scoreMap.get(character);
        }
      }
    }

    return 0;
  }
}

let inputs: string[];

const rawData = readFileSync("./day10inputs.txt", "utf8");

inputs = rawData.split("\r\n");

let chunkLines = inputs.map((i) => new ChunkLine(i));

let sumOfSyntaxErrorScores = chunkLines.reduce(
  (rollingSum, currentLine) => rollingSum + currentLine.score(),
  0
);

console.log(sumOfSyntaxErrorScores);
