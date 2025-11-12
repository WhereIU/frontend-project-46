import formatDiff from './src/parsers.js';

export default function parse(path1, path2, format) {
  return formatDiff(path1, path2, format);
}

const res = parse('__fixtures__/file1.json', '__fixtures__/file2.json')
console.log(res)
