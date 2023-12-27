import { test, expect } from "bun:test";

import { readInput } from "./utils";

let input = await readInput(24);

type Coord = [x: number, y: number];
type Grid = (Type | `${number}`)[][];

enum Type {
  Wall = "#",
  Passage = ".",
}

const DELTAS: Coord[] = [
  [0, 1],
  [0, -1],
  [1, 0],
  [-1, 0],
];

function path(from: number, to: number) {
  return `${from} -> ${to}` as const;
}

class DistanceMap {
  private _distances: Record<`${number} -> ${number}`, number> = {};

  get(from: number, to: number) {
    return this._distances[path(from, to)];
  }

  register(from: number, to: number, distance: number) {
    this._distances[path(from, to)] = this._distances[path(to, from)] =
      distance;
  }
}

function computeDistances(
  distances: DistanceMap,
  grid: Grid,
  [x, y]: Coord,
  nums: number[],
) {
  const num = +grid[y][x];

  const visited: Record<string, 1> = { [`${x},${y}`]: 1 };
  const queue: [Coord, steps: number][] = [[[x, y], 0]];

  root: while (queue.length && nums.length) {
    const [[x, y], steps] = queue.shift()!;

    for (const [X, Y] of DELTAS) {
      const [nextX, nextY] = [x + X, y + Y];
      const key = `${nextX},${nextY}`;
      const next = grid[nextY]?.[nextX];

      if (next && next !== Type.Wall && !visited[key]) {
        visited[key] = 1;

        if (next === Type.Passage) {
          queue.push([[nextX, nextY], steps + 1]);
          continue;
        }

        const i = nums.indexOf(+next);

        if (~i) {
          nums.splice(i, 1);
          distances.register(num, +next, steps + 1);
        }

        continue root;
      }
    }
  }
}

function computeMinSteps(
  distances: DistanceMap,
  from: number,
  destinations: number[],
  goBack: boolean,
) {
  if (!destinations.length) {
    return goBack ? distances.get(from, 0) : 0;
  }

  let min = Infinity;

  for (const to of destinations) {
    min = Math.min(
      min,
      distances.get(from, to) +
        computeMinSteps(
          distances,
          to,
          destinations.filter((dest) => dest !== to),
          goBack,
        ),
    );
  }

  return min;
}

function solution(goBack: boolean) {
  const grid: Grid = input.split("\n").map((row) => row.split("") as any);

  const distances = new DistanceMap();
  const coords: Record<number, Coord> = {};

  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      const n = +grid[y][x];

      if (!isNaN(n)) {
        coords[n] = [x, y];
      }
    }
  }

  const N = Object.keys(coords).length;
  const nums = Array.from({ length: N }, (_, i) => i);

  for (let i = 0; i < N - 1; i++) {
    computeDistances(distances, grid, coords[i], nums.slice(i + 1));
  }

  return computeMinSteps(distances, 0, nums.slice(1), goBack);
}

test("part1", () => {
  expect(solution(false)).toBe(430);
});

test("part2", () => {
  expect(solution(true)).toBe(700);
});
