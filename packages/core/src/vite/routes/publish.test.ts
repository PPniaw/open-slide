import { describe, expect, it } from 'vitest';
import { parsePublishedUrl } from './publish.ts';

describe('publish route helpers', () => {
  it('reads the live url from the publish command output', () => {
    const output = '  ✔ 打包結果只包含：deck\n...\n  ✔ 已上線：https://deck.vercel.app\n';
    expect(parsePublishedUrl(output)).toBe('https://deck.vercel.app');
    expect(parsePublishedUrl('vercel deploy 失敗')).toBeNull();
  });
});
