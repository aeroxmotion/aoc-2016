import { readFile } from "node:fs/promises";
import { writeFileSync } from "node:fs";

export async function readInput(day: number): Promise<string> {
  if (!Bun.env.SESSION) {
    throw new Error("Missing env session");
  }

  const response = await fetch(
    `https://adventofcode.com/2016/day/${day}/input`,
    {
      headers: {
        Cookie: `session=${Bun.env.SESSION}`,
      },
    },
  );

  return (await response.text()).trim();
}

export async function cacheFS<T>(name: string) {
  const { promise, resolve } = Promise.withResolvers();
  const filename = `.cache/${name}_cached.json`;

  let content = "{}";

  try {
    content = await readFile(filename, {
      encoding: "utf8",
    });
  } catch (error) {}

  const store: Record<string, any> = JSON.parse(content);

  promise.then(() =>
    // Writing to files apparently needs to be sync (on Bun -- at least)
    writeFileSync(filename, JSON.stringify(store), { encoding: "utf8" }),
  );

  return (key: string, compute: () => T) => {
    if (!store[key]) {
      store[key] = compute();

      // Modified, need write!!
      // Schedule write on a microtask
      resolve();
    }

    return store[key];
  };
}
