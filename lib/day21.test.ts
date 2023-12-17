import { test, expect } from "bun:test";

import { readInput } from "./utils";

let input = await readInput(21);

function rotate<T>(arr: T[], times: number) {
  const L = arr.length;
  const N = L + times;

  const buf = new Array<T>(L);

  for (let i = times; i < N; i++) {
    const I = i % L;
    const J = i - times;

    buf[I] = arr[I];
    arr[I] = buf[J] || arr[J];
  }
}

test("part1", () => {
  let result: string[] = "abcdefgh".split("");

  const pos = (i: string) => (isNaN(+i) ? result.indexOf(i) : +i);

  for (const line of input.split("\n")) {
    const ins = line.split(" ");

    switch (ins[0]) {
      case "swap":
        const [a, b] = [pos(ins[2]), pos(ins[5])];

        [result[a], result[b]] = [result[b], result[a]];
        break;

      case "move":
        const [from, to] = [+ins[2], +ins[5]];

        result.splice(to, 0, ...result.splice(from, 1));
        break;

      case "reverse":
        const [start, end] = [+ins[2], +ins[4]];
        const diff = (end - start) / 2;

        for (let i = 0; i <= diff; i++) {
          const left = start + i;
          const right = end - i;

          [result[left], result[right]] = [result[right], result[left]];
        }
        break;

      case "rotate":
        // based on letter position...
        if (ins[1] === "based") {
          const index = result.indexOf(ins[6]);
          rotate(result, index + 1 + +(index >= 4));
        } else if (ins[1] === "right") {
          rotate(result, +ins[2]);
        } else {
          // TODO
        }

        break;
    }
  }
});
