import { test, expect } from "bun:test";

import { readInput } from "./utils";

let input = await readInput(21);

function rotate<T>(arr: T[], times: number) {
  const len = arr.length;

  arr.push(...arr.splice(0, ((-times % len) + len) % len));

  return arr;
}

function rotateBy<T>(arr: T[], value: T) {
  const i = arr.indexOf(value);

  return rotate(arr, i + 1 + +(i >= 4));
}

function solution(initial: string, revert: boolean) {
  const lines = input.split("\n");
  const result = initial.split("");

  const pos = (i: string) => (isNaN(+i) ? result.indexOf(i) : +i);
  const swap = (i: number, j: number) =>
    ([result[i], result[j]] = [result[j], result[i]]);

  if (revert) {
    lines.reverse();
  }

  for (const line of lines) {
    const [_0, _1, _2, _3, _4, _5, _6] = line.split(" ");

    switch (_0) {
      case "swap":
        swap(pos(_2), pos(_5));
        break;

      case "move":
        const [from, to] = [+(revert ? _5 : _2), +(revert ? _2 : _5)];

        result.splice(to, 0, ...result.splice(from, 1));
        break;

      case "reverse":
        for (let i = +_2, j = +_4; i < j; i++, j--) {
          swap(i, j);
        }
        break;

      case "rotate":
        if (_1 !== "based") {
          rotate(result, (_1 === "right" ? !revert : revert) ? +_2 : -_2);
        } else if (!revert) {
          rotateBy(result, _6);
        } else {
          const target = result.join("");

          while (rotateBy(result.slice(), _6).join("") !== target) {
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
