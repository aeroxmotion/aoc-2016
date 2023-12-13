import { test, expect } from "bun:test";

import { readInput } from "./utils";

let input = await readInput(8);

enum Light {
  On = "#",
  Off = ".",
}

function solution<T extends boolean>(
  code: T,
): T extends true ? string : number {
  const WIDTH = 50;
  const HEIGHT = 6;

  let lightsOn = 0;
  const screen: Light[][] = Array.from({ length: HEIGHT }, () =>
    Array(WIDTH).fill(Light.Off),
  );

  for (const line of input.split("\n")) {
    const [ins, ...args] = line.split(" ");

    if (ins === "rect") {
      const [width, height] = args[0].split("x").map(Number);

      for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
          if (screen[i][j] === Light.Off) {
            screen[i][j] = Light.On;
            lightsOn++;
          }
        }
      }
    } else {
      const [_, s, __, n] = args;
      const [axis, index] = s.split("=");
      const isRow = axis === "y";

      const idx = +index;
      const R = +n;
      const I = isRow ? WIDTH : HEIGHT;
      const buf: Light[] = Array(I);

      // Rotate right
      for (let i = R; i < I + R; i++) {
        const j = i % I;
        const k = i - R;

        const l = isRow ? idx : j;
        const m = isRow ? j : idx;

        buf[j] = screen[l][m];
        screen[l][m] = buf[k] || screen[isRow ? idx : k][isRow ? k : idx];
      }
    }
  }

  if (!code) {
    return lightsOn as any;
  }

  return screen.map((row) => row.join("")).join("\n") as any;
}

test("part1", () => {
  expect(solution(false)).toBe(110);
});

test("part2", () => {
  expect(solution(true)).toMatchSnapshot();
});
