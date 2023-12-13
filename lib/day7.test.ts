import { test, expect } from "bun:test";

import { readInput } from "./utils";

let input = await readInput(7);

test("part1", () => {
  let supportTLS = 0;

  const isABBA = (line: string, i: number) =>
    line[i] !== line[i - 2] &&
    line[i] === line[i - 3] &&
    line[i - 2] === line[i - 1];

  root: for (const line of input.split("\n")) {
    let brackets = 0;
    let found = false;

    // ABBA found per-depth
    const abba: Record<number, 1> = {};

    for (let i = 0; i < line.length; i++) {
      switch (line[i]) {
        case "[":
          brackets++;
          break;

        case "]":
          if (brackets && abba[brackets--]) {
            continue root;
          }
          break;

        default: {
          if (i >= 3 && isABBA(line, i)) {
            abba[brackets] = 1;
            found = true;
          }
        }
      }
    }

    if (found) {
      supportTLS++;
    }
  }

  expect(supportTLS).toBe(105);
});

test("part2", () => {
  let supportSSL = 0;

  const isABA = (line: string, i: number) =>
    line[i] === line[i - 2] && line[i] !== line[i - 1];

  const isSSL = ({ [0]: root, ...record }: Record<number, string[]>) => {
    if (root) {
      for (const depth in record) {
        const aba = record[depth];

        for (const left of aba) {
          for (const right of root) {
            if (left[0] === right[1] && left[1] === right[0]) {
              return true;
            }
          }
        }
      }
    }

    return false;
  };

  root: for (const line of input.split("\n")) {
    let brackets = 0;

    // ABA-BAB found per-depth
    const record: Record<number, string[]> = {};

    for (let i = 0; i < line.length; i++) {
      switch (line[i]) {
        case "[":
          brackets++;
          break;

        case "]":
          brackets && brackets--;

          if (isSSL(record)) {
            supportSSL++;
            continue root;
          }
          break;

        default: {
          if (i >= 2 && isABA(line, i)) {
            (record[brackets] || (record[brackets] = [])).push(
              line.slice(i - 2, i + 1),
            );

            if (isSSL(record)) {
              supportSSL++;
              continue root;
            }
          }
        }
      }
    }
  }

  expect(supportSSL).toBe(258);
});
