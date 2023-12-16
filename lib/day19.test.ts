import { test, expect } from "bun:test";

import { readInput } from "./utils";

interface Elf {
  n: number;
  next: Elf;
}

let input = await readInput(19);

test("part1", () => {
  const head: Elf = { n: 1, next: null! };
  let current = head;

  for (let n = 2; n <= +input; n++) {
    current = current.next = { n, next: null! };
  }

  for (
    current = current.next = head;
    current.next !== current; // Find the cycle!
    current = current.next = current.next.next
  );

  expect(current.n).toBe(1_834_903);
});

test("part2", () => {
  const N = +input;

  let elf = 1;

  for (let i = 1; i < N; i++) {
    if ((elf = (elf % i) + 1) > (i + 1) / 2) {
      elf++;
    }
  }

  expect(elf).toBe(1_420_280);
});
