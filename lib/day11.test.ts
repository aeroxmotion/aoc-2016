import { test, expect } from "bun:test";

import { readInput } from "./utils";

let input = await readInput(11);

type State = string[][];

const PARSE_REGEX = /[a-z-]+ (generator|microchip)/g;

function hash(state: State) {
  return state.map((floor, i) => `${i}:${floor.slice().sort()}`).join(";");
}

function clone(state: State): State {
  return state.map((floor) => floor.slice());
}

function findSolution(
  state: State,
  visited: Record<string, 1>,
  total: number,
  floor: number,
  steps: number,
  minSteps: number,
) {
  // Found a solution?
  if (state[3].length === total) {
    return steps;
  }

  const floors = [];

  if (floor - 1 > 0) {
    floors.push(floor - 1);
  }

  if (floor + 1 < state.length - 1) {
    floors.push(floor + 1);
  }

  let min = Infinity;

  // Collection of micros/generators that can be moved away from this floor...
  const canBeMoved: string[] = [];

  // Key:
  // -1 => Has RTG (only)
  //  1 => Has Microchip (only)
  //  0 => Has RTG and Microchip (connected)
  const sums: Record<string, number> = {};

  for (const microOrGenerator of state[floor]) {
    const [_, type] = microOrGenerator.split(" ");
    sums[microOrGenerator] +=
      (sums[microOrGenerator] || 0) + (type === "microchip" ? 1 : -1);
  }

  for (const name in sums) {
    const value = sums[name];

    if (value !== 0) {
      canBeMoved.push(name);
    } else {
      for (const _name in sums) {
        if (name === _name) {
          continue;
        }

        const compareValue = sums[_name];
      }
    }
  }

  for (const nextFloor of floors) {
  }

  return min;
}

test("part1", () => {
  let total = 0;
  const floors: State = [];

  for (const line of input.split("\n")) {
    const match = line.match(PARSE_REGEX)!;

    if (!match) {
      floors.push([]);
    } else {
      total += match.length;
      floors.push(match.map((r) => r.replace("-compatible", "")));
    }
  }

  console.log("Floors");
  console.log(floors.join("\n"), total);
});
