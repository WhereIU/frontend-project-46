import { program } from 'commander';
import { jsonParser } from './parsers.js';

program
  .name('gendiff')
  .version('1.0.0')
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'output format')
  .arguments('<filepath1> <filepath2>')
  .action((filePath1, filePath2) => console.log(jsonParser(filePath1, filePath2)));

program.parse();
