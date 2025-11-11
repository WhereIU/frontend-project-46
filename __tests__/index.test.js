import { fileURLToPath } from 'node:url';
import path, { dirname } from 'node:path';
import fs from 'node:fs';
import genDiff from '../index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const joinObjectValue = (object, key) => object[key].join('\n');

function compare(filesExtention) {
  const path1 = getFixturePath(`file1.${filesExtention}`);
  const path2 = getFixturePath(`file2.${filesExtention}`);
  const results = JSON.parse(fs.readFileSync(getFixturePath('results.json'), 'utf-8'));
  expect(genDiff(path1, path2)).toEqual(joinObjectValue(results, 'res1'));
}

test('genDiff json', () => {
  compare('json');
});

test('genDiff yml/yaml', () => {
  compare('yml');
});
