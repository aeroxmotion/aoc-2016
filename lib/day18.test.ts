import { test, expect } from "bun:test";

import { readInput } from "./utils";

let input = await readInput(18);

enum Type {
  "^" = 1,
  "." = -1,
}

type Row = (keyof typeof Type)[];

function solution(rows: number) {
  let i = rows - 1;
  let row = input.split("") as Row;
  let total = row.reduce((sum, v) => sum + +(Type[v] === Type["."]), 0);

  while (i--) {
    let nextRow: Row = [];

    for (let j = 0; j < row.length; j++) {
      let sum = 0;

      for (let k = -1; k < 2; k++) {
        sum += Type[row[j + k] ?? "."];
      }

      const trap = row[j] === "^";

      if (sum === 1 ? trap : sum === -1 && !trap) {
        nextRow.push("^");
      } else {
        nextRow.push(".");
        total++;
      }
    }

    row = nextRow;
  }

  return total;
}

test("part1", () => {
  expect(solution(40)).toBe(2_035);
});

test("part2", () => {
  expect(solution(400_000)).toBe(20_000_577);
});
