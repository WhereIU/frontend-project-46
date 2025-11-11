import { fileURLToPath } from 'node:url';
import path, { dirname } from 'node:path';
import fs from 'node:fs';
import yaml from 'js-yaml';
import genDiff from '../index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const joinObjectValue = (object, key) => object[key].join('\n');

test('genDiff json flat', () => {
  const path1 = getFixturePath('file1.json');
  const path2 = getFixturePath('file2.json');
  const results = JSON.parse(fs.readFileSync(getFixturePath('results.json'), 'utf-8'));
  expect(genDiff(path1, path2)).toEqual(joinObjectValue(results, 'res1'));
});

test('genDiff yml/yaml flat', () => {
  const path1 = getFixturePath('file1.yml');
  const path2 = getFixturePath('file2.yaml');
  const results = yaml.load(fs.readFileSync(getFixturePath('results.yml'), 'utf-8'));
  expect(genDiff(path1, path2)).toEqual(joinObjectValue(results, 'res1'));
});
