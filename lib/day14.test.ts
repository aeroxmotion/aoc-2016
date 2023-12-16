import { test, expect } from "bun:test";

import { readInput } from "./utils";

let input = await readInput(14);

const TRIPLET_REGEX = /(.)\1{2}/;

test("part1", () => {
  let i = 0;
  let keys = 0;

  const N = 1000;
  const hashes: string[] = new Array();
  const candidates: string[] = [];

  root: while (true) {
    let hash = `${input}${i}`;

    for (let x = 0; x <= 2016; x++) {
      hash = hashes[i] = new Bun.CryptoHasher("md5").update(hash).digest("hex");
    }

    const triplet = TRIPLET_REGEX.exec(hash)?.[1];

    if (triplet) {
      candidates[i] = triplet;
    }

    const I = i - N;
    const candidate = candidates[I];

    if (candidate) {
      const quintuplet = candidate.repeat(5);

      for (let j = 1; j < N; j++) {
        if (hashes[I + j].includes(quintuplet)) {
          if (++keys >= 64) {
            break root;
          }

          break;
        }
      }
    }

    i++;
  }

  console.log("I:", i - 1000);
});
