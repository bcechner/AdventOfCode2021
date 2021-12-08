import { readFileSync } from "fs";

let inputs: string[];

const rawData = readFileSync("./day2inputs.txt", "utf8");

inputs = rawData.split("\r\n");

let aim = 0;
let depth = 0;
let horizontalPosition = 0;

for (let input of inputs) {
  let seperatorIndex = input.indexOf(" ");

  const instruction = input.substring(0, seperatorIndex);
  const quantity = Number(input.substring(seperatorIndex + 1));

  switch (instruction) {
    case "forward": {
      horizontalPosition += quantity;
      depth += aim * quantity;
      break;
    }
    case "up": {
      aim -= quantity;
      break;
    }
    case "down": {
      aim += quantity;
      break;
    }
  }
}

console.log(depth);
console.log(horizontalPosition);
console.log(depth * horizontalPosition);
