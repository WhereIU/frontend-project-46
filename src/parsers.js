import fs from 'node:fs';
import path from 'node:path';
import _ from 'lodash';
import yaml from 'js-yaml';
import * as formatter from './formatters.js';

const getFullPath = (filePath) => path.resolve(filePath);
const parseData = (data1, data2) => {
  const keys = _.union(Object.keys(data1), Object.keys(data2)).sort();

  return keys.map((key) => {
    const val1 = data1[key];
    const val2 = data2[key];
    if (_.isObject(val1) && _.isObject(val2)) {
      return { key, type: 'nested', children: parseData(val1, val2) };
    }
    if (!Object.hasOwn(data1, key)) {
      return { key, type: 'added', value: val2 };
    }
    if (!Object.hasOwn(data2, key)) {
      return { key, type: 'removed', value: val1 };
    }
    if (!_.isEqual(val1, val2)) {
      return {
        key, type: 'updated', oldValue: val1, newValue: val2,
      };
    }

    return { key, type: 'unchanged', value: val1 };
  });
};

const formatDiff = (filePath1, filePath2, format) => {
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

  const diffTree = parseData(data1, data2);
  const normalizedFormat = format?.toLowerCase().trim();
  switch (normalizedFormat) {
    case 'stylish':
      return formatter.stylish(diffTree);
    case 'plain':
      return formatter.plain(diffTree);
    case 'json':
      return formatter.json(diffTree);
    default:
      return undefined;
  }
};
export default formatDiff;
