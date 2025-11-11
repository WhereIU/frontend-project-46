import { execSync } from 'node:child_process';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import path, { dirname } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);

const cliPath = path.resolve('./src/cli.js');
const path1 = getFixturePath('file1.json');
const path2 = getFixturePath('file2.json');
const results = JSON.parse(fs.readFileSync(getFixturePath('results.json'), 'utf-8'));
const joinObjectValue = (object, key) => object[key].join('\n');

test('gendiff CLI works end-to-end', () => {
  const output = execSync(`node ${cliPath} ${path1} ${path2}`).toString().trim();
  expect(output).toEqual(joinObjectValue(results, 'res1'));
});
