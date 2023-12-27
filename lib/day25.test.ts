import { test, expect } from "bun:test";

import { readInput } from "./utils";

let input = await readInput(25);

const TARGET_LEN = 8;
const MATCH_STR = "01".repeat(TARGET_LEN / 2);

function solution() {
  const instructions: string[][] = [];

  for (const line of input.split("\n")) {
    instructions.push(line.split(" "));
  }

  let a = 0;

  while (true) {
    let pc = 0;

    const signal: number[] = [];
    const reg: Record<string, number> = {
      a,
      b: 0,
      c: 0,
      d: 0,
    };

    const resolve = (value: string) => reg[value] ?? +value;

    root: while (pc < instructions.length) {
      const [ins, _0, _1] = instructions[pc];

      switch (ins) {
        case "cpy":
          reg[_1] = resolve(_0);
          break;

        case "inc":
          reg[_0]++;
          break;

        case "dec":
          reg[_0]--;
          break;

        case "jnz":
          if (resolve(_0)) {
            pc += resolve(_1);
            continue root;
          }
          break;

        case "out":
          if (signal.push(resolve(_0)) >= TARGET_LEN) {
            if (signal.join("") === MATCH_STR) {
              return a;
            }

            break root;
          }
          break;

        default: {
          throw new Error(`Unkwnown instruction ${ins}`);
        }
      }

      pc++;
    }

    a++;
  }
}

test("abc", () => {
  expect(solution()).toBe(198);
});
