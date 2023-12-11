import { test, expect } from "bun:test";

import { readInput } from "./utils";

let input = await readInput(2);

function solution(grid: (string | number)[][]) {
  let result = "";

  let i = 0; // up-down
  let j = 0; // left-right

  // Find start
  root: for (let _i = 0; _i < grid.length; _i++) {
    for (let _j = 0; _j < grid[_i].length; _j++) {
      if (grid[_i][_j] === 5) {
        i = _i;
        j = _j;

        break root;
      }
    }
  }

  for (const instructions of input.split("\n")) {
    for (const ins of instructions) {
      switch (ins) {
        case "U":
          if (grid[i - 1]?.[j]) {
            i--;
          }
          break;

        case "D":
          if (grid[i + 1]?.[j]) {
            i++;
          }
          break;

        case "R":
          if (grid[i][j + 1]) {
            j++;
          }
          break;

        case "L":
          if (grid[i][j - 1]) {
            j--;
          }
          break;
      }
    }

    result += grid[i][j];
  }

  return result;
}

test("part1", () => {
  expect(
    solution([
      [1, 2, 3], //
      [4, 5, 6], //
      [7, 8, 9], //
    ]),
  ).toBe("82958");
});

test("part2", () => {
  expect(
    solution([
      [0, 0, 1, 0, 0],
      [0, 2, 3, 4, 0],
      [5, 6, 7, 8, 9],
      [0, "A", "B", "C", 0],
      [0, 0, "D", 0, 0],
    ]),
  ).toBe("B3DB8");
});
