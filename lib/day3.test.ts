import { test, expect } from "bun:test";

import { readInput } from "./utils";

let input = await readInput(3);

function solution(generator: (grid: number[][]) => Generator<number[]>) {
  let possible = 0;

  const grid = input
    .split("\n")
    .map((row) => row.trim().split(/\s+/).map(Number));

  root: for (const sides of generator(grid)) {
    const side = (i: number) => sides[i % sides.length];

    for (let i = 0; i < sides.length; i++) {
      if (side(i) >= side(i + 1) + side(i + 2)) {
        continue root;
      }
    }

    possible++;
  }

  return possible;
}

test("part1", () => {
  expect(
    solution(function* (grid) {
      for (const row of grid) {
        yield row;
      }
    }),
  ).toBe(917);
});

test("part2", () => {
  expect(
    solution(function* (grid) {
      for (let j = 0; j < grid[0].length; j++) {
        for (let i = 0; i < grid.length; i += 3) {
          yield [grid[i][j], grid[i + 1][j], grid[i + 2][j]];
        }
      }
    }),
  ).toBe(1_649);
});
