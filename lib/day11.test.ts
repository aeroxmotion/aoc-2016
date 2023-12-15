import { test, expect } from "bun:test";

import { readInput } from "./utils";

let input = await readInput(11);

type Item = number & {};
type Floor = Item[];
type State = Floor[];

enum Type {
  RTG = -1,
  Chip = 1,
}

let id = 1;
const IDs: Record<string, number> = {};
const PARSE_REGEX = /[a-z-]+ (generator|microchip)/g;

function item(name: string): Item {
  let [_name, type] = name.split(" ");
  const delta = type === "generator" ? Type.RTG : Type.Chip;

  _name = _name.replace("-compatible", "");

  return (IDs[_name] || (IDs[_name] = id++)) * delta;
}

function hash(state: State, floor: number) {
  return `${floor}:${state.map((_floor) => _floor.join(",")).join(";")}`;
}

function clone(state: State): State {
  return state.map((floor) => floor.slice());
}

function perms(state: State, floor: number) {
  const moves: Item[][] = [];

  for (const move of state[floor]) {
    moves.push([move]);

    for (const other of state[floor]) {
      if (move !== other) {
        moves.push([move, other]);
      }
    }
  }

  return moves;
}

function isValid(state: State, floor: number) {
  const items = state[floor];

  // Just microchips or just RTGs?
  if (items[0] > 0 || items[items.length - 1] < 0) {
    return true;
  }

  for (const item of items) {
    if (item > 0 && !items.includes(-item)) {
      return false;
    }
  }

  return true;
}

function sort(floor: Floor) {
  return floor.sort((a, b) => a - b);
}

function swap(state: State, floor: number, nextFloor: number, items: Item[]) {
  const nextState = clone(state);

  nextState[floor] = sort(
    nextState[floor].filter((item) => !items.includes(item)),
  );
  nextState[nextFloor] = sort([...nextState[nextFloor], ...items]);

  return nextState;
}

function solution(extraItems: string[] = []) {
  let total = 0;
  const initial: State = [];

  for (const line of input.split("\n")) {
    const match = line.match(PARSE_REGEX)!;

    if (!match) {
      initial.push([]);
    } else {
      total += match.length;
      initial.push(sort(match.map(item)));
    }
  }

  if (extraItems.length) {
    initial[0] = sort([...initial[0], ...extraItems.map(item)]);
    total += extraItems.length;
  }

  const visited: Record<string, 1> = { [hash(initial, 0)]: 1 };
  const queue: [State, floor: number, steps: number][] = [[initial, 0, 0]];

  while (queue.length) {
    const [state, floor, steps] = queue.shift()!;

    const deltas = []
      .concat(floor > 0 ? -1 : ([] as any))
      .concat(floor < state.length - 1 ? 1 : ([] as any));

    const moves = perms(state, floor);

    for (const delta of deltas) {
      const nextFloor = floor + delta;

      for (const move of moves) {
        const nextState = swap(state, floor, nextFloor, move);
        const key = hash(nextState, nextFloor);

        if (
          visited[key] ||
          !isValid(nextState, floor) ||
          !isValid(nextState, nextFloor)
        ) {
          continue;
        }

        // Goal?
        if (nextState[nextState.length - 1].length === total) {
          return steps + 1;
        }

        visited[key] = 1;
        queue.push([nextState, nextFloor, steps + 1]);
      }
    }
  }

  return Infinity;
}

test("part1", () => {
  expect(solution()).toBe(33);
});

test("part2", () => {
  expect(
    solution([
      "elerium generator",
      "elerium-compatible microchip",
      "dilithium generator",
      "dilithium-compatible microchip",
    ]),
  ).toBe(57);
});
