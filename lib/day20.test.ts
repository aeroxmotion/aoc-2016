import { test, expect } from "bun:test";

import { readInput } from "./utils";

let input = await readInput(20);

type Range = [start: number, end: number];

const MAX_32 = 9;

function solution(total: boolean) {
  const ranges: Range[] = [];
  const bounds: number[] = [];

  for (const line of input.split("\n")) {
    const [start, end] = line.split("-").map(Number);
    const nextStart = start - 1;
    const nextEnd = end + 1;

    ranges.push([start, end]);

    if (nextStart >= 0) {
      bounds.push(nextStart);
    }

    if (nextEnd <= MAX_32) {
      bounds.push(nextEnd);
    }
  }

  const result: number[] = [];

  root: for (const bound of bounds) {
    for (const [start, end] of ranges) {
      if (bound >= start && bound <= end) {
        continue root;
      }
    }

    result.push(bound);
  }

  return total ? result.length : Math.min(...result);
}

test("part1", () => {
  expect(solution(false)).toBe(32_259_706);
});

test("part2", () => {
  expect(solution(true)).toBe(113);
});
