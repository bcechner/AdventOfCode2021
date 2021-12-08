import { readFileSync } from "fs";

class TestableMember {
  checked: boolean = false;
  value: number;

  constructor(value: number) {
    this.value = value;
  }

  public test(input: number) {
    this.checked = this.checked || input === this.value;
  }
}

class TestableCollection {
  private members: TestableMember[] = [];

  public addMember(member: number) {
    this.members.push(new TestableMember(member));
  }

  public markInput(input: number) {
    this.members.forEach((m) => m.test(input));
  }

  public test(): boolean {
    return this.members.every((m) => m.checked);
  }

  public addUnmarkedValues() {
    return this.members.reduce<number>((latestReduction, member) => {
      if (!member.checked) {
        return latestReduction + member.value;
      }

      return latestReduction;
    }, 0);
  }
}

class BingoBoard {
  private rows: TestableCollection[] = [];
  private columns: TestableCollection[] = [];

  constructor(rows: string[]) {
    const gridSize = rows.length;

    for (let i = 0; i < gridSize; i++) {
      this.rows.push(new TestableCollection());
      this.columns.push(new TestableCollection());
    }

    rows.forEach((row, rowIndex) => {
      row
        .split(" ")
        .filter((i) => i !== " " && i !== "")
        .forEach((number, columnIndex) => {
          this.rows[rowIndex].addMember(Number(number));
          this.columns[columnIndex].addMember(Number(number));
        }, this);
    });
  }

  public markInput(input: number) {
    this.columns.forEach((c) => c.markInput(input));
    this.rows.forEach((r) => r.markInput(input));
  }

  public won() {
    return (
      this.rows.some((r) => r.test()) || this.columns.some((r) => r.test())
    );
  }

  public addUnmarkedNumbers() {
    let latestSum = 0;

    for (let row of this.rows) {
      latestSum += row.addUnmarkedValues();
    }

    return latestSum;
  }
}

let inputs: string[];

const rawData = readFileSync("./day4inputs.txt", "utf8");

inputs = rawData.split("\r\n");

const bingoInputs = inputs.shift();

inputs = inputs.filter((i) => i !== "");

const gridSize = 5;

const bingoBoards: BingoBoard[] = [];

for (let i = 0; i < inputs.length; i += gridSize) {
  bingoBoards.push(new BingoBoard(inputs.slice(i, i + gridSize)));
}

let winningInput = 0;

for (let input of bingoInputs.split(",")) {
  let numericalInput = Number(input);

  bingoBoards.forEach((b) => b.markInput(numericalInput));

  if (bingoBoards.some((b) => b.won())) {
    winningInput = numericalInput;
    break;
  }
}

const winningBoard = bingoBoards.find((b) => b.won());
const sumOfUnmarkedNumbers = winningBoard.addUnmarkedNumbers();

console.log(sumOfUnmarkedNumbers * winningInput);
