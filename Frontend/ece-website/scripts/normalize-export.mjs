// Next 16.4 Windows export uses backslashes when flattening RSC segment paths.
// Match the framework's slash-to-dot filename format; Linux output is unchanged.
import { readdir, rename, access } from 'node:fs/promises';
import path from 'node:path';
if (process.platform === 'win32') {
  const root = path.resolve('out');
  async function walk(dir) {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      const file = path.join(dir, entry.name);
      if (entry.isDirectory()) await walk(file);
      else {
        const parts = path.relative(root, file).split(path.sep);
        const segment = parts.findIndex(part => part.startsWith('__next.'));
        if (segment < 0 || segment === parts.length - 1 || !file.endsWith('.txt')) continue;
        const target = path.join(root, ...parts.slice(0, segment), parts.slice(segment).join('.'));
        try { await access(target); throw new Error('Duplicate export payload: ' + target); }
        catch (error) { if (error.code !== 'ENOENT') throw error; }
        await rename(file, target);
      }
    }
  }
  await walk(root);
}
