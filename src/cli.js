import { program } from 'commander'
import formatDiff from './parsers.js'

program
  .name('gendiff')
  .version('1.0.0')
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'output format', 'stylish')
  .arguments('<filepath1> <filepath2>')
  .action(
    (filePath1, filePath2, { format }) => console.log(formatDiff(filePath1, filePath2, format)),
  )

program.parse()
