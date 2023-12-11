import { test, expect } from "bun:test";

import { readInput } from "./utils";

let input = await readInput(6);

function solution(least = false) {
  const lines = input.split("\n");

  let corrected = "";

  for (let j = 0; j < lines[0].length; j++) {
    const common: Record<string, number> = {};

    for (let i = 0; i < lines.length; i++) {
      const char = lines[i].charAt(j);

      common[char] = (common[char] || 0) + 1;
    }

    let commonChar = ["" as string, least ? Infinity : -Infinity] as const;

    for (const char in common) {
      const n = common[char];

      if (least ? n < commonChar[1] : n > commonChar[1]) {
        commonChar = [char, n];
      }
    }

    corrected += commonChar[0];
  }

  return corrected;
}

test("part1", () => {
  expect(solution()).toBe("tkspfjcc");
});

test("part2", () => {
  expect(solution(true)).toBe("xrlmbypn");
});
