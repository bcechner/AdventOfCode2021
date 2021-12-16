import { readFileSync } from "fs";

class Node {
  public risk: number;
  private _adjacentNodes: Node[] = [];

  public visited = false;
  public safestPath: number = Infinity;

  public get adjacentNodes(): Node[] {
    return this._adjacentNodes;
  }

  constructor(risk: number) {
    this.risk = risk;
  }
}

type Path = {
  risk: number | null;
  length: number | null;
};

class RiskMap {
  private rows: Node[][] = [];
  private endingPoint: Node = null;

  public addRow(rowInput: string) {
    this.rows.push(rowInput.split("").map((i) => new Node(Number(i))));
  }

  public buildMap(): this {
    const numberOfColumns = this.rows[0].length;
    const numberOfRows = this.rows.length;

    for (let y = 0; y < numberOfRows; y++) {
      for (let x = 0; x < numberOfColumns; x++) {
        let point = this.getNodes(x, y);

        if (y != 0) {
          point.adjacentNodes.push(this.getNodes(x, y - 1));
        }

        if (y + 1 < numberOfRows) {
          point.adjacentNodes.push(this.getNodes(x, y + 1));
        }

        if (x != 0) {
          point.adjacentNodes.push(this.getNodes(x - 1, y));
        }

        if (x + 1 < numberOfColumns) {
          point.adjacentNodes.push(this.getNodes(x + 1, y));
        }
      }
    }

    this.endingPoint = this.rows[numberOfColumns - 1][numberOfRows - 1];

    return this;
  }

  public findSafestPath() {
    const startingNode = this.rows[0][0];
    startingNode.risk = 0;
    startingNode.safestPath = 0;

    const nodes = this.rows.flat();

    // Dijkstra
    while (nodes.length !== 0) {
      let node = nodes.sort((a, b) => a.safestPath - b.safestPath)[0];

      node.visited = true;

      nodes.shift();

      const nodesToConsider = node.adjacentNodes.filter((n) => !n.visited);

      for (let adjacentNode of nodesToConsider) {
        if (node.safestPath + adjacentNode.risk < adjacentNode.safestPath) {
          adjacentNode.safestPath = node.safestPath + adjacentNode.risk;
        }
      }
    }

    return this.endingPoint.safestPath;
  }

  public getNodes(x, y) {
    return this.rows[y][x];
  }
}

let inputs: string[];

const rawData = readFileSync("./day15inputs.txt", "utf8");

inputs = rawData.split("\r\n");

const riskMap = new RiskMap();

for (let input of inputs) {
  riskMap.addRow(input);
}

riskMap.buildMap();
console.log(riskMap.findSafestPath());
