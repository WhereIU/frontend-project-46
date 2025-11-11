import fs from 'node:fs';
import path from 'node:path';
import _ from 'lodash';

const getFullPath = (filePath) => path.resolve(filePath);

export const jsonParser = (filePath1, filePath2) => {
  const data1 = JSON.parse(
    fs.readFileSync(
      getFullPath(filePath1),
      'utf-8',
    ),
  );
  const data2 = JSON.parse(
    fs.readFileSync(
      getFullPath(filePath2),
      'utf-8',
    ),
  );
  const sortedKeys = _.union(Object.keys(data1), Object.keys(data2)).sort();

  const diff = sortedKeys.reduce((acc, key) => {
    if (Object.hasOwn(data1, key)) {
      if (data1[key] === data2[key]) acc.push(`    ${key}: ${data1[key]}`);
      else {
        acc.push(`  - ${key}: ${data1[key]}`);
        if (Object.hasOwn(data2, key)) acc.push(`  + ${key}: ${data2[key]}`);
      }
    } else acc.push(`  + ${key}: ${data2[key]}`);

    return acc;
  }, ['{']);

  diff.push('}');
  return diff.join('\n');
};

