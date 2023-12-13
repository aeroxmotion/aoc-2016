import { test, expect } from "bun:test";

import { readInput } from "./utils";

let input = await readInput(9);

const PARSE_REGEX = /\((?<l>\d+)x(?<t>\d+)\)/g;

function computeLength(line: string, recursive: boolean) {
  let index = 0;
  let result = 0;
  let match: RegExpExecArray | null;

  while ((match = PARSE_REGEX.exec(line))) {
    const { l, t } = match.groups!;
    const len = +l;
    const times = +t;
    const offset = match.index + match[0].length;

    // Left side
    result += index - match.index;

    // Since `PARSE_REGEX` is global, we should reset its `lastIndex`
    // before calling `computeLength` again.
    PARSE_REGEX.lastIndex = 0;

    // Repetition
    result += recursive
      ? computeLength(line.slice(offset, offset + len), true) * times
      : len * times;

    // Update last index
    PARSE_REGEX.lastIndex = index = offset + len;
  }

  return result + line.length - index;
}

function solution(recursive = false) {
  let len = 0;

  for (const line of input.split("\n")) {
    len += computeLength(line, recursive);
  }

  return len;
}

test("part1", () => {
  expect(solution()).toBe(98135);
});

test("part2", () => {
  expect(solution(true)).toBe(10_964_557_606);
});
