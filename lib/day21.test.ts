import { test, expect } from "bun:test";

import { readInput } from "./utils";

let input = await readInput(21);

function rotate(arr: string[], times: number) {
  const L = arr.length;
  const T = Math.abs(times);
  const N = L + T;

  const buf = new Array<string>(L);

  for (let i = T; i < N; i++) {
    const I = i % L;
    const J = (i - times) % L;

    buf[I] = arr[I];
    arr[I] = buf[J] || arr[J];
  }

  return arr;
}

function rotateLetter(arr: string[], letter: string) {
  const i = arr.indexOf(letter);

  rotate(arr, i + 1 + +(i >= 4));

  return arr;
}

function solution(initial: string, revert: boolean) {
  const lines = input.split("\n");

  let result: string[] = initial.split("");

  const pos = (i: string) => (isNaN(+i) ? result.indexOf(i) : +i);

  if (revert) {
    lines.reverse();
  }

  for (const line of lines) {
    const ins = line.split(" ");

    switch (ins[0]) {
      case "swap":
        const [a, b] = [pos(ins[2]), pos(ins[5])];

        [result[a], result[b]] = [result[b], result[a]];
        break;

      case "move":
        const [from, to] = [+ins[revert ? 5 : 2], +ins[revert ? 2 : 5]];

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
        if (ins[1] !== "based") {
          rotate(
            result,
            (ins[1] === "right" ? !revert : revert) ? +ins[2] : -ins[2],
          );
        } else if (!revert) {
          rotateLetter(result, ins[6]);
        } else {
          const l = ins[6];
          const target = result.join("");

          while (rotateLetter(result.slice(), l).join("") !== target) {
            // Keep rotating left until we found a matching string
            rotate(result, -1);
          }
        }
        break;
    }
  }

  return result.join("");
}

test("part1", () => {
  expect(solution("abcdefgh", false)).toBe("hcdefbag");
});

test("part2", () => {
  expect(solution("fbgdceah", true)).toBe("fbhaegdc");
});
