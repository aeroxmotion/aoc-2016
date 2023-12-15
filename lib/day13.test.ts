import { test, expect } from "bun:test";

import { readInput } from "./utils";

let input = await readInput(13);
const N = +input;

type Coord = [x: number, y: number];

enum Type {
  Open,
  Wall,
}

const DELTAS: Coord[] = [
  [0, -1], // Top
  [1, 0], // Right
  [0, 1], // Bottom
  [-1, 0], // Left
];

function hash(coord: Coord) {
  return coord.join(",");
}

function neighbors([x, y]: Coord) {
  return DELTAS.map(([X, Y]) => [x + X, y + Y]).filter(
    ([x, y]) => Math.min(x, y) >= 0 && type([x, y]) === Type.Open,
  ) as Coord[];
}

function type([x, y]: Coord) {
  let bits = 0;
  let n = x * x + 3 * x + 2 * x * y + y + y * y + N;

  while (n > 0) {
    bits += n & 1;
    n >>= 1;
  }

  return bits & 1 ? Type.Wall : Type.Open;
}

function solution(maxSteps = Infinity) {
  let minSteps = 0;

  const start: Coord = [1, 1];
  const visited: Record<string, 1> = { [hash(start)]: 1 };
  const queue: [Coord, steps: number][] = [[start, minSteps]];

  while (queue.length) {
    const [coord, steps] = queue.shift()!;

    if (steps >= maxSteps) {
      return Object.keys(visited).length;
    }

    for (const neighbor of neighbors(coord)) {
      const key = hash(neighbor);

      if (key === "31,39") {
        return steps + 1;
      }

      if (!visited[key]) {
        visited[key] = 1;
        queue.push([neighbor, steps + 1]);
      }
    }
  }

  return Infinity;
}

test("part1", () => {
  expect(solution()).toBe(92);
});

test("part2", () => {
  expect(solution(50)).toBe(124);
});
