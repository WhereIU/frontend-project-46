import formatDiff from './src/parsers.js'

export default function parse(path1, path2, format) {
  return formatDiff(path1, path2, format)
}
