import { test, expect } from "bun:test";

import { cacheFS, readInput } from "./utils";

let input = await readInput(14);

const TRIPLET_REGEX = /(.)\1\1/;
const QUINTUPLET_REGEX = /(.)\1{4}/;

async function solution(stretch = 1) {
  let i = 0;
  let keys = 0;
  let maxI = -Infinity;

  const N = 1000;
  const triplets: Record<string, number[]> = {};

  // Pre-fill with empty indexes
  for (let i = 0; i < 16; i++) {
    triplets[i.toString(16)] = [];
  }

  const cache = await cacheFS(`day14_${stretch}`);

  root: while (true) {
    const initial = `${input}${i}`;

    const hash = cache(initial, () => {
      let _hash = initial;

      for (let j = 0; j < stretch; j++) {
        _hash = new Bun.CryptoHasher("md5").update(_hash).digest("hex");
      }

      return _hash;
    });

    const quintuplet = QUINTUPLET_REGEX.exec(hash)?.[1];

    if (!quintuplet) {
      const triplet = TRIPLET_REGEX.exec(hash)?.[1];

      triplet && triplets[triplet].push(i);
    } else {
      for (const index of triplets[quintuplet]) {
        if (i - index < N) {
          keys++;
          maxI = Math.max(maxI, index);

          if (keys >= 64) {
            break root;
          }
        }
      }

      triplets[quintuplet] = [i];
    }

    i++;
  }

  return maxI;
}

test("part1", async () => {
  expect(await solution(1)).toBe(23_769);
});

test("part2", async () => {
  expect(await solution(2_017)).toBe(20_606);
});
