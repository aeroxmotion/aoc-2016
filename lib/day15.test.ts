import { test, expect } from "bun:test";

import { readInput } from "./utils";

let input = await readInput(15);

type Disc = [i: number, positions: number];

const PARSE_REGEX = /(?<len>\d+) positions;.+position (?<pos>\d+)/;

function parse() {
  const discs: Disc[] = [];

  for (const line of input.split("\n")) {
    const { pos, len } = PARSE_REGEX.exec(line)!.groups!;

    discs.push([+pos, +len]);
  }

  return discs;
}

function solution(extraDisc?: Disc) {
  const discs = parse();
  let time = 1;

  extraDisc && discs.push(extraDisc);

  root: while (true) {
    for (let i = 1; i <= discs.length; i++) {
      const disc = discs[i - 1];

      if ((time + i + disc[0]) % disc[1]) {
        time++;
        continue root;
      }
    }

    return time;
  }
}

test("part1", () => {
  expect(solution()).toBe(400_589);
});

test("part2", () => {
  expect(solution([0, 11])).toBe(3_045_959);
});
