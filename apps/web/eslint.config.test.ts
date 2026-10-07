import { ESLint } from 'eslint';
import { describe, expect, it } from 'vitest';

const eslint = new ESLint();

async function restrictedImportErrors(code: string, filePath: string) {
  const [result] = await eslint.lintText(code, { filePath });

  return result.messages.filter(
    (message) => message.ruleId === 'no-restricted-imports',
  );
}

describe('eslint config: no-restricted-imports', () => {
  it('blocks motion imports outside src/components/motion', async () => {
    const errors = await restrictedImportErrors(
      "import { m } from 'motion/react-m';\n",
      'src/components/Hero.tsx',
    );

    expect(errors).toHaveLength(1);
  });

  it('allows importing primitives from @/components/motion', async () => {
    const errors = await restrictedImportErrors(
      "import { Reveal } from '@/components/motion';\n",
      'src/components/Contact.tsx',
    );

    expect(errors).toHaveLength(0);
  });

  it('allows motion imports inside src/components/motion', async () => {
    const errors = await restrictedImportErrors(
      "import { m } from 'motion/react-m';\n",
      'src/components/motion/Reveal.tsx',
    );

    expect(errors).toHaveLength(0);
  });

  it('still blocks next/font/google inside src/components/motion', async () => {
    const errors = await restrictedImportErrors(
      "import { Inter } from 'next/font/google';\n",
      'src/components/motion/Reveal.tsx',
    );

    expect(errors).toHaveLength(1);
  });
}, 30_000);
