import { readFileSync } from "fs";

enum PacketType {
  sum = 0,
  product = 1,
  minimum = 2,
  maximum = 3,
  literal = 4,
  greaterThan = 5,
  lessThan = 6,
  equaltTo = 7,
}

class Packet {
  public version: number;
  public type: PacketType;

  constructor(version: number, type: PacketType) {
    this.version = version;
    this.type = type;
  }
}

class Literal extends Packet {
  public value: number;

  constructor(version: number, value: number) {
    super(version, PacketType.literal);

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
        let operator = new Operator(packetVersion, packetType);

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

function performOperation(packet: Packet): number {
  switch (packet.type) {
    case PacketType.sum: {
      return (packet as Operator).subPackets.reduce(
        (rollingSum, subPacket) => rollingSum + performOperation(subPacket),
        0
      );
    }
    case PacketType.product: {
      return (packet as Operator).subPackets.reduce(
        (rollingSum, subPacket) => rollingSum * performOperation(subPacket),
        1
      );
    }
    case PacketType.minimum: {
      return (packet as Operator).subPackets
        .map((subPacket) => performOperation(subPacket))
        .sort((a, b) => a - b)[0];
    }
    case PacketType.literal: {
      return (packet as Literal).value;
    }
    case PacketType.maximum: {
      return (packet as Operator).subPackets
        .map((subPacket) => performOperation(subPacket))
        .sort((a, b) => b - a)[0];
    }
    case PacketType.greaterThan: {
      if (packet instanceof Operator) {
        if (packet.subPackets.length !== 2) {
          throw new Error("Too many subpackets");
        }

        return performOperation(packet.subPackets[0]) >
          performOperation(packet.subPackets[1])
          ? 1
          : 0;
      }
    }
    case PacketType.lessThan: {
      if (packet instanceof Operator) {
        if (packet.subPackets.length !== 2) {
          throw new Error("Too many subpackets");
        }

        return performOperation(packet.subPackets[0]) <
          performOperation(packet.subPackets[1])
          ? 1
          : 0;
      }
    }
    case PacketType.equaltTo: {
      if (packet instanceof Operator) {
        if (packet.subPackets.length !== 2) {
          throw new Error("Too many subpackets");
        }

        return performOperation(packet.subPackets[0]) ===
          performOperation(packet.subPackets[1])
          ? 1
          : 0;
      }
    }
    default: {
      throw new Error("Not Implemented");
    }
  }
}

const rawInput = readFileSync("./day16inputs.txt", "utf8");

const binaryPacket = convertToBinary(rawInput).split("");

let packetProcessor = new PacketProcessor();

const packetTree = packetProcessor.process(binaryPacket);

console.log(performOperation(packetTree));
