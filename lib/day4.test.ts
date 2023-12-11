import { test, expect } from "bun:test";

import { readInput } from "./utils";

let input = await readInput(4);
const PARSE_REGEX = /^(?<enc>[a-z-]+)-(?<id>\d+)\[(?<checksum>[a-z]+)\]$/;

test("part1", () => {
  let sum = 0;

  for (const line of input.split("\n")) {
    const { enc, id, checksum } = PARSE_REGEX.exec(line)!.groups!;
    const common: Record<string, number> = {};

    for (const char of enc) {
      common[char] = (common[char] || 0) + 1;
    }

    delete common["-"];

    const target = Object.keys(common).sort(
      (a, b) => common[b] - common[a] || a.charCodeAt(0) - b.charCodeAt(0),
    );

    if (checksum === target.slice(0, 5).join("")) {
      sum += parseInt(id);
    }
  }

  expect(sum).toBe(137_896);
});

test("part2", () => {
  const MIN = "a".charCodeAt(0);
  const MAX = "z".charCodeAt(0) - MIN + 1;
  const TARGET = "northpole object storage";

  let targetRoomId = -1;

  for (const line of input.split("\n")) {
    const { enc, id } = PARSE_REGEX.exec(line)!.groups!;
    let decrypted = "";
    const roomId = parseInt(id);

    for (const s of enc) {
      decrypted +=
        s === "-"
          ? " "
          : String.fromCharCode(((s.charCodeAt(0) - MIN + roomId) % MAX) + MIN);
    }

    if (decrypted === TARGET) {
      targetRoomId = roomId;
      break;
    }
  }

  expect(targetRoomId).toBe(501);
});
