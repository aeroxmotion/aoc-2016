import { test, expect } from "bun:test";

import { readInput } from "./utils";

let input = await readInput(17);

type Coord = [x: number, y: number];

const OPEN_REGEX = /[b-f]/;

const DELTAS: [dir: "U" | "D" | "L" | "R", ...Coord][] = [
  ["U", 0, -1], // up
  ["D", 0, 1], // down
  ["L", -1, 0], // left
  ["R", 1, 0], // right
];

function solution<T extends boolean>(
  longest: T,
): T extends true ? number : string {
  let maxSteps = -Infinity;

  const SIZE = 4;
  const queue: [Coord, steps: string][] = [[[0, 0], ""]];

  while (queue.length) {
    const [[x, y], steps] = queue.shift()!;
    const hash = new Bun.CryptoHasher("md5")
      .update(`${input}${steps}`)
      .digest("hex");

    for (let i = 0; i < DELTAS.length; i++) {
      const [dir, X, Y] = DELTAS[i];

      if (OPEN_REGEX.test(hash[i])) {
        const nextX = x + X;
        const nextY = y + Y;
        const nextSteps = steps + dir;

        if (nextX === 3 && nextY === 3) {
          if (!longest) {
            return nextSteps as any;
          }

          maxSteps = Math.max(maxSteps, nextSteps.length);
          continue;
        }

        if (nextX >= 0 && nextY >= 0 && nextX < SIZE && nextY < SIZE) {
          queue.push([[nextX, nextY], nextSteps]);
        }
      }
    }
  }

  return maxSteps as any;
}

test("part1", () => {
  expect(solution(false)).toBe("DURLDRRDRD");
});

test("part2", () => {
  expect(solution(true)).toBe(650);
});
