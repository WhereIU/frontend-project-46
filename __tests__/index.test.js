import { fileURLToPath } from 'node:url';
import path, { dirname } from 'node:path';
import fs from 'node:fs';
import { describe } from 'node:test';
import genDiff from '../index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const joinObjectValue = (object, key) => object[key].join('\n');

function compare(filesExtention, format) {
  const path1 = getFixturePath(`file1.${filesExtention}`);
  const path2 = getFixturePath(`file2.${filesExtention}`);
  const results = JSON.parse(fs.readFileSync(getFixturePath('results.json'), 'utf-8'));
  expect(genDiff(path1, path2, format)).toEqual(joinObjectValue(results, format));
}

describe('genDiff', () => {
  const fileFormats = ['json', 'yml'];
  const outputFormats = ['stylish', 'plain'];

  const testFactory = (fileType, outputFormat) => {
    test(`genDiff ${fileType} files with ${outputFormat} format`, () => {
      compare(fileType, outputFormat);
    });
  };

  fileFormats.forEach((fileType) => {
    outputFormats.forEach((outputFormat) => {
      testFactory(fileType, outputFormat);
    });
  });
});
