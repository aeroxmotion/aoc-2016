import { test, expect } from "bun:test";

import { readInput } from "./utils";

let input = await readInput(1);
const DELTAS = [1 /* N */, 1 /* E */, -1 /* S */, -1 /* W */];
const N = DELTAS.length;

function solution(twice = false) {
  let i = 0; // delta index
  const blocks = [0 /* N */, 0 /* E */];
  const visited: Record<string, 1> = {
    [blocks.join(",")]: 1,
  };

  root: for (let ins of input.split(",")) {
    ins = ins.trim();

    const dir = ins.charAt(0);
    let num = parseInt(ins.slice(1));

    i = dir === "R" ? (i + 1) % N : (i ? i : N) - 1;

    while (num--) {
      blocks[i % 2] += DELTAS[i];

      const hash = blocks.join(",");

      if (twice && visited[hash]) {
        break root;
      }

      visited[hash] = 1;
    }
  }

  return blocks.reduce((sum, n) => sum + Math.abs(n), 0);
}

test("part1", () => {
  expect(solution()).toBe(353);
});

test("part2", () => {
  expect(solution(true)).toBe(152);
});
