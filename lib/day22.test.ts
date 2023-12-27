import { test, expect } from "bun:test";

import { readInput } from "./utils";

let input = await readInput(22);

test("part1", () => {
  interface Node {
    used: number;
    avail: number;
  }

  const nodes: Node[] = [];

  for (const line of input.split("\n").slice(2)) {
    const [, , used, avail] = line.split(/\s+/);

    nodes.push({
      used: parseInt(used),
      avail: parseInt(avail),
    });
  }

  let pairs = 0;

  for (const A of nodes) {
    if (A.used) {
      for (const B of nodes) {
        pairs += +(A !== B && A.used <= B.avail);
      }
    }
  }

  expect(pairs).toBe(981);
});

test("part2", () => {
  type Grid = string[][];
  type Coord = [x: number, y: number];

  const DELTAS: Coord[] = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
  ];

  let emptyCoord: Coord = [-1, -1];
  const grid: Grid = [];

  for (const line of input.split("\n").slice(2)) {
    const [name, , used] = line.split(/\s+/);
    const parts = name.split("-");
    const [x, y] = [+parts[1].slice(1), +parts[2].slice(1)];

    if (!grid[y]) {
      grid[y] = [];
    }

    const u = parseInt(used);

    if (!u) {
      emptyCoord = [x, y];
    }

    grid[y][x] = u > 100 ? "#" : !u ? "_" : ".";
  }

  grid[0][grid[0].length - 1] = "G";

  let stepsToGoal = 0;
  const queue: [Coord, steps: number][] = [[emptyCoord, 0]];
  const visited: Record<string, 1> = {};

  while (queue.length) {
    const [[x, y], steps] = queue.shift()!;

    if (y === 0 && x === grid[0].length - 2) {
      stepsToGoal = steps;
      break;
    }

    for (const [X, Y] of DELTAS) {
      const [nextX, nextY] = [x + X, y + Y];
      const next = grid[nextY]?.[nextX];
      const key = `${nextX},${nextY}`;

      if (next && next === "." && !visited[key]) {
        queue.push([[nextX, nextY], steps + 1]);
        visited[key] = 1;
      }
    }
  }

  let goal = grid[0].length - 2;
  stepsToGoal++;

  while (goal) {
    // 1 step --> Exchange
    // 4 steps --> Put empty node right on the left of the goal
    stepsToGoal += 5;
    goal--;
  }

  expect(stepsToGoal).toBe(233);
});
