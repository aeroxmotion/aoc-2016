import { test, expect } from "bun:test";

import { readInput } from "./utils";

let input = await readInput(23);

function solution(a: number, mul: boolean) {
  const reg: Record<string, number> = {
    a,
    b: 0,
    c: 0,
    d: 0,
  };

  const toggling: Record<string, string> = {
    cpy: "jnz",
    jnz: "cpy",
    dec: "inc",
    inc: "dec",
  };

  const resolve = (value: string) => {
    const n = +value;

    return isNaN(n) ? reg[value] : n;
  };

  const instructions: string[][] = [];

  for (const line of input.split("\n")) {
    instructions.push(line.split(" "));
  }

  let pc = 0;

  root: while (pc < instructions.length) {
    if (mul && pc === 4) {
      reg.a += reg.b * reg.d;
      reg.c = reg.d = 0;
      pc = 10;
      continue;
    }

    const [ins, ...args] = instructions[pc];

    switch (ins) {
      case "cpy":
        if (args[1] in reg) {
          reg[args[1]] = resolve(args[0]);
        }
        break;

      case "inc":
        reg[args[0]]++;
        break;

      case "dec":
        reg[args[0]]--;
        break;

      case "jnz":
        if (resolve(args[0])) {
          pc += resolve(args[1]);
          continue root;
        }
        break;

      case "tgl":
        const i = pc + resolve(args[0]);

        if (instructions[i]) {
          instructions[i][0] = toggling[instructions[i][0]];
        }
        break;

      default: {
        throw new Error(`Unkwnown instruction ${ins}`);
      }
    }

    pc++;
  }

  return reg.a;
}

test("part1", () => {
  expect(solution(7, false)).toBe(12_860);
});

test("part2", () => {
  expect(solution(12, true)).toBe(479_009_420);
});
