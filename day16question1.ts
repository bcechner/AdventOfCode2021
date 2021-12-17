import { readFileSync } from "fs";

enum PacketType {
  literal = 4,
}

class Packet {
  public version: number;

  constructor(version: number) {
    this.version = version;
  }
}

class Literal extends Packet {
  public value: number;

  constructor(version: number, value: number) {
    super(version);

    this.value = value;
  }
}

class Operator extends Packet {
  public subPackets: Packet[] = [];
}

class PacketProcessor {
  public process(binaryPacket: string[]): Packet {
    const packetVersion = parseInt(binaryPacket.splice(0, 3).join(""), 2);
    const packetType = parseInt(binaryPacket.splice(0, 3).join(""), 2);

    switch (packetType) {
      case PacketType.literal: {
        return new Literal(packetVersion, this.findLiteralValue(binaryPacket));
      }
      default: {
        let operator = new Operator(packetVersion);

        const lengthTypeId = binaryPacket.shift();

        if (lengthTypeId === "0") {
          let lengthOfSubpackets = parseInt(
            binaryPacket.splice(0, 15).join(""),
            2
          );

          let startingLength = binaryPacket.length;

          while (startingLength - binaryPacket.length !== lengthOfSubpackets) {
            operator.subPackets.push(this.process(binaryPacket));
          }
        } else {
          let numberOfSubpackets = parseInt(
            binaryPacket.splice(0, 11).join(""),
            2
          );

          for (let i = 0; i < numberOfSubpackets; i++) {
            operator.subPackets.push(this.process(binaryPacket));
          }
        }

        return operator;
      }
    }
  }

  private findLiteralValue(binaryPacket: string[]): number {
    let endingGroupFound = false;

    let binaryLiteralValue = "";

    while (!endingGroupFound) {
      let processingGroup = binaryPacket.splice(0, 5);

      if (processingGroup.shift() === "0") {
        endingGroupFound = true;
      }

      binaryLiteralValue += processingGroup.join("");
    }

    return parseInt(binaryLiteralValue, 2);
  }
}

function convertToBinary(hexString) {
  let result: string = "";

  for (let hexCharacter of hexString) {
    let binaryString = parseInt(hexCharacter, 16).toString(2);

    while (binaryString.length !== 4) {
      binaryString = "0" + binaryString;
    }

    result += binaryString;
  }

  return result;
}

function findVersionTotal(packet: Packet): number {
  let versionTotal = packet.version;

  if (packet instanceof Operator) {
    for (let subPacket of packet.subPackets) {
      versionTotal += findVersionTotal(subPacket);
    }
  }

  return versionTotal;
}

const rawInput = readFileSync("./day16inputs.txt", "utf8");

const binaryPacket = convertToBinary(rawInput).split("");

let packetProcessor = new PacketProcessor();

const packetTree = packetProcessor.process(binaryPacket);

console.log(findVersionTotal(packetTree));
