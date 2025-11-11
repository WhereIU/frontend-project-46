import fs from 'node:fs';
import path from 'node:path';
import _ from 'lodash';
import yaml from 'js-yaml';

const getFullPath = (filePath) => path.resolve(filePath);
const stringify = (value, depth) => {
  if (!_.isObject(value)) {
    return String(value);
  }

  const indent = ' '.repeat(depth * 4);
  const bracketIndent = ' '.repeat((depth - 1) * 4);
  const entries = Object.entries(value)
    .map(([key, val]) => `${indent}${key}: ${stringify(val, depth + 1)}`)
    .join('\n');

  return `{\n${entries}\n${bracketIndent}}`;
};

const parseData = (data1, data2, depth = 1) => {
  const indent = ' '.repeat(depth * 4 - 2);
  const keys = _.union(Object.keys(data1), Object.keys(data2)).sort();

  const lines = keys.map((key) => {
    const val1 = data1[key];
    const val2 = data2[key];

    if (_.isObject(val1) && _.isObject(val2)) {
      const nested = parseData(val1, val2, depth + 1);
      return `${' '.repeat(depth * 4)}${key}: ${nested}`;
    }

    if (!Object.hasOwn(data2, key)) {
      return `${indent}- ${key}: ${stringify(val1, depth + 1)}`;
    }

    if (!Object.hasOwn(data1, key)) {
      return `${indent}+ ${key}: ${stringify(val2, depth + 1)}`;
    }

    if (_.isEqual(val1, val2)) {
      return `${' '.repeat(depth * 4)}${key}: ${stringify(val1, depth + 1)}`;
    }

    return [
      `${indent}- ${key}: ${stringify(val1, depth + 1)}`,
      `${indent}+ ${key}: ${stringify(val2, depth + 1)}`,
    ].join('\n');
  });

  const bracketIndent = ' '.repeat((depth - 1) * 4);
  return `{\n${lines.join('\n')}\n${bracketIndent}}`;
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
