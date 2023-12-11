import { test, expect } from "bun:test";

import { readInput } from "./utils";

let input = await readInput(5);

function hash(i: number) {
  const hasher = new Bun.CryptoHasher("md5");

  hasher.update(`${input}${i++}`);

  return hasher.digest("hex");
}

test("part1", () => {
  let i = 0;
  let result = "";

  while (true) {
    const hex = hash(i++);

    if (hex.startsWith("00000")) {
      result += hex.charAt(5);

      if (result.length === 8) {
        break;
      }
    }
  }

  expect(result).toBe("f97c354d");
});

test("part2", () => {
  let i = 0;
  let filled = 0;
  let result = new Array<string>(8);

  while (true) {
    const hex = hash(i++);

    if (hex.startsWith("00000")) {
      const position = parseInt(hex.charAt(5));

      if (isNaN(position) || position >= result.length) {
        continue;
      }

      if (!result[position]) {
        result[position] = hex.charAt(6);

        if (++filled >= 8) {
          break;
        }
      }
    }
  }

  expect(result.join("")).toBe("863dde27");
});
