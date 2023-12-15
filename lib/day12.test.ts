import { test, expect } from "bun:test";

import { readInput } from "./utils";

let input = await readInput(12);

function solution(c = 0) {
  const registries: Record<string, number> = {
    a: 0,
    b: 0,
    c,
    d: 0,
  };

  const resolve = (value: string) => {
    const n = +value;

    return isNaN(n) ? registries[value] : n;
  };

  const instructions: string[][] = [];

  for (const line of input.split("\n")) {
    instructions.push(line.split(" "));
  }

  let i = 0;

  root: while (i < instructions.length) {
    const [ins, ...args] = instructions[i];

    switch (ins) {
      case "cpy":
        registries[args[1]] = resolve(args[0]);
        break;

      case "inc":
        registries[args[0]]++;
        break;

      case "dec":
        registries[args[0]]--;
        break;

      case "jnz":
        if (resolve(args[0])) {
          i += resolve(args[1]);
          continue root;
        }
        break;

      default: {
        throw new Error(`Unkwnown instruction ${ins}`);
      }
    }

    i++;
  }

  return registries.a;
}

test("part1", () => {
  expect(solution()).toBe(318_007);
});

test("part2", () => {
  expect(solution(1)).toBe(9_227_661);
});
