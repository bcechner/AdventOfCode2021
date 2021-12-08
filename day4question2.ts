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
  private _isWinningBoard: boolean = false;

  public get isWinningBoard(): boolean {
    return this._isWinningBoard;
  }

  protected set isWinningBoard(value: boolean) {
    this._isWinningBoard = value;
  }

  private _winningRound: number = -1;

  public get winningRound(): number {
    return this._winningRound;
  }

  protected set winningRound(value: number) {
    this._winningRound = value;
  }

  private _winningInput: number = -1;

  public get winningInput(): number {
    return this._winningInput;
  }

  protected set winningInput(value: number) {
    this._winningInput = value;
  }

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

  public markInput(input: number, round: number) {
    this.columns.forEach((c) => c.markInput(input));
    this.rows.forEach((r) => r.markInput(input));

    if (
      !this.isWinningBoard &&
      (this.rows.some((r) => r.test()) || this.columns.some((r) => r.test()))
    ) {
      this.isWinningBoard = true;
      this.winningRound = round;
      this.winningInput = input;
    }
  }

  public addUnmarkedNumbers() {
    let rollingSum = 0;

    for (let row of this.rows) {
      rollingSum += row.addUnmarkedValues();
    }

    return rollingSum;
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

let roundCounter = 0;

for (let input of bingoInputs.split(",")) {
  bingoBoards.forEach((b) => b.markInput(Number(input), roundCounter));

  if (bingoBoards.every((b) => b.isWinningBoard)) {
    break;
  }

  roundCounter++;
}

const lastWinningBoard = bingoBoards
  .filter((b) => b.isWinningBoard)
  .sort((a, b) => a.winningRound - b.winningRound)[bingoBoards.length - 1];

const sumOfUnmarkedNumbers = lastWinningBoard.addUnmarkedNumbers();

console.log(sumOfUnmarkedNumbers * lastWinningBoard.winningInput);
