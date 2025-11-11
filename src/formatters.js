import _ from 'lodash';

const toString = (value) => (typeof value === 'string' ? `'${value}'` : String(value));

export const stylish = (tree, depth = 1) => {
  const indent = ' '.repeat(depth * 4 - 2);
  const bracketIndent = ' '.repeat((depth - 1) * 4);

  const formatValue = (val, lvl) => {
    if (!_.isObject(val)) return String(val);
    const entries = Object.entries(val)
      .map(([k, v]) => `${' '.repeat(lvl * 4)}${k}: ${formatValue(v, lvl + 1)}`)
      .join('\n');
    return `{\n${entries}\n${' '.repeat((lvl - 1) * 4)}}`;
  };

  const lines = tree.map((node) => {
    const {
      key, type, value, oldValue, newValue, children,
    } = node;

    switch (type) {
      case 'nested':
        return `${' '.repeat(depth * 4)}${key}: ${stylish(children, depth + 1)}`;
      case 'added':
        return `${indent}+ ${key}: ${formatValue(value, depth + 1)}`;
      case 'removed':
        return `${indent}- ${key}: ${formatValue(value, depth + 1)}`;
      case 'updated':
        return [
          `${indent}- ${key}: ${formatValue(oldValue, depth + 1)}`,
          `${indent}+ ${key}: ${formatValue(newValue, depth + 1)}`,
        ].join('\n');
      case 'unchanged':
        return `${' '.repeat(depth * 4)}${key}: ${formatValue(value, depth + 1)}`;
      default:
        return '';
    }
  });

  return `{\n${lines.join('\n')}\n${bracketIndent}}`;
};

export const plain = (tree, parent = '') => {
  const lines = tree.flatMap((node) => {
    const propertyPath = parent ? `${parent}.${node.key}` : node.key;

    switch (node.type) {
      case 'nested':
        return plain(node.children, propertyPath);

      case 'added': {
        const value = _.isObject(node.value) ? '[complex value]' : toString(node.value);
        return `Property '${propertyPath}' was added with value: ${value}`;
      }

      case 'removed':
        return `Property '${propertyPath}' was removed`;

      case 'updated': {
        const oldVal = _.isObject(node.oldValue) ? '[complex value]' : toString(node.oldValue);
        const newVal = _.isObject(node.newValue) ? '[complex value]' : toString(node.newValue);
        return `Property '${propertyPath}' was updated. From ${oldVal} to ${newVal}`;
      }

      case 'unchanged':
      default:
        return [];
    }
  });

  return lines.join('\n');
};
