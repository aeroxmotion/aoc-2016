import { test, expect } from "bun:test";

import { readInput } from "./utils";

let input = await readInput(10);

type Type = "bot" | "output";

class RecordQueue<T = number> {
  data: Record<number, T[]> = {};

  put(n: number, d: T, sort = true) {
    const data = this.data[n] || (this.data[n] = []);

    data.push(d);

    if (sort && data.length >= 2) {
      (data as number[]).sort((a, b) => a - b);
    }

    return data.length;
  }

  get(n: number) {
    const result = this.data[n];
    this.data[n] = [];

    return result;
  }
}

function solution(output: number[] | null = null) {
  let startBot = -1;
  const transitions = new RecordQueue<[Type, number]>();
  const types: Record<Type, RecordQueue> = {
    bot: new RecordQueue(),
    output: new RecordQueue(),
  };

  for (const line of input.split("\n")) {
    const parts = line.split(" ");

    // Initial chip -> bot
    if (line.startsWith("value")) {
      const bot = +parts[5];

      if (types.bot.put(bot, +parts[1]) >= 2) {
        startBot = bot;
      }

      // Transition bot -> <low:<target>|high:<target>>
    } else {
      const from = +parts[1];

      // Put low
      transitions.put(from, [parts[5] as Type, +parts[6]], false);

      // Put high
      transitions.put(from, [parts[10] as Type, +parts[11]], false);
    }
  }

  const stack = [startBot];

  while (stack.length) {
    const bot = stack.pop()!;
    const [lowChip, highChip] = types.bot.get(bot);
    const [[lowType, lowTarget], [highType, highTarget]] = transitions.get(bot);

    if (lowChip === 17 && highChip === 61 && !output) {
      return bot;
    }

    if (types[lowType].put(lowTarget, lowChip) >= 2 && lowType === "bot") {
      stack.push(lowTarget);
    }

    if (types[highType].put(highTarget, highChip) >= 2 && highType === "bot") {
      stack.push(highTarget);
    }
  }

  return output!.reduce((result, i) => result * types.output.get(i)[0], 1);
}

test("part1", () => {
  expect(solution()).toBe(47);
});

test("part2", () => {
  expect(solution([0, 1, 2])).toBe(2_666);
});
