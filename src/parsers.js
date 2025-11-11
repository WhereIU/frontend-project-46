import fs from 'node:fs';
import path from 'node:path';
import _ from 'lodash';
import yaml from 'js-yaml';

const getFullPath = (filePath) => path.resolve(filePath);

const parseData = (data1, data2) => {
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

const parseFiles = (filePath1, filePath2) => {
  const [data1, data2] = [filePath1, filePath2].map((filePath) => {
    const extension = filePath.split('.').at(-1);
    const rawData = fs.readFileSync(
      getFullPath(filePath),
      'utf-8',
    );
    switch (extension) {
      case 'yml':
      case 'yaml':
        return yaml.load(rawData);
      default:
        return JSON.parse(rawData);
    }
  });
  return parseData(data1, data2);
};

export default parseFiles;
