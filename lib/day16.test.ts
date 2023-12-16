import { test, expect } from "bun:test";

import { readInput } from "./utils";

let input = await readInput(16);

function solution(length: number) {
  let data = input.split("").map(Number);

  while (data.length < length) {
    const a = data; // Call the data you have at this point "a".
    const b = a.slice(); // Make a copy of "a"; call this copy "b".

    b.reverse(); // Reverse the order of the characters in "b".

    // In "b", replace all instances of 0 with 1 and all 1s with 0.
    for (let i = 0; i < b.length; i++) {
      b[i] = b[i] ^ 1;
    }

    // The resulting data is "a", then a single 0, then "b".
    data = [...a, 0, ...b];
  }

  let checksum = data.slice(0, length);

  while (!(checksum.length & 1)) {
    const next: number[] = [];

    for (let i = 0; i < checksum.length; i += 2) {
      next.push(+(checksum[i] === checksum[i + 1]));
    }

    checksum = next;
  }

  return checksum.join("");
}

test("part1", () => {
  expect(solution(272)).toBe("11100111011101111");
});

test("part2", () => {
  expect(solution(35_651_584)).toBe("10001110010000110");
});
