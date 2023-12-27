import { test, expect } from "bun:test";

import { readInput } from "./utils";

let input = await readInput(20);

type Range = [start: number, end: number];

const MAX_32 = 4_294_967_295;

function solution(total: boolean) {
  const ranges = input
    .split("\n")
    .map((line) => {
      const [start, end] = line.split("-");

      return [+start, +end];
    })
    .sort((a, b) => a[0] - b[0] || a[1] - b[1]) as Range[];

  let i = 0;
  let ip = 0;
  let sum = 0;

  while (ip < MAX_32 && i < ranges.length) {
    const [start, end] = ranges[i];

    if (ip < start) {
      if (!total) {
        return ip;
      }

      sum += start - ip;
      ip = start;
    } else if (ip > end) {
      i++;
    } else {
      ip = end + 1;
    }
  }

  return total ? sum || MAX_32 - ip + 1 : ip;
}

test("part1", () => {
  expect(solution(false)).toBe(32_259_706);
});

test("part2", () => {
  expect(solution(true)).toBe(113);
});
