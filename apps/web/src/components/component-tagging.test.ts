import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const componentsDir = import.meta.dirname;

const componentFiles = readdirSync(componentsDir).filter(
  (file) => file.endsWith('.tsx') && !file.endsWith('.test.tsx'),
);

describe('component tagging', () => {
  it.each(componentFiles)('%s tags its root with devComponentProps', (file) => {
    const name = path.basename(file, '.tsx');
    const relativePath = `src/components/${file}`;
    const source = readFileSync(path.join(componentsDir, file), 'utf8');

    const call = new RegExp(
      `devComponentProps\\(\\s*'${name}'\\s*,\\s*'${relativePath.replace(/\./g, '\\.')}',?\\s*\\)`,
    );

    expect(source).toMatch(call);
  });
});
