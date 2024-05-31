import { fileURLToPath } from 'url';
import path from 'node:path';
import { dirname } from 'path';
import fs from 'node:fs';
import genDiff from '../index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const joinObjectValue = (object, key) => object[key].join('\n');

const path1 = getFixturePath('file1.json');
const path2 = getFixturePath('file2.json');
const results = JSON.parse(fs.readFileSync(getFixturePath('results.json'), 'utf-8'));

test('genDiff', () => {
  expect(genDiff(path1, path2)).toEqual(joinObjectValue(results, 'res1'));
});
