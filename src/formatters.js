import _ from 'lodash';

const toString = (value, wrapper="'") => (typeof value === 'string' ? `${wrapper}${value}${wrapper}` : String(value));
/* eslint-disable no-use-before-define */
const formatObject = (obj, depth) => {
  const indent = ' '.repeat((depth + 1) * 2);
  const closingIndent = ' '.repeat(depth * 2);

  const entries = Object.entries(obj);
  const lines = entries.map(([k, v], i) => {
    const stricktK = String(k)
    const comma = i === entries.length - 1 ? '' : ',';
    if (_.isArray(v)) return `${indent}"${stricktK}": ${formatArray(v, depth + 1)}${comma}`;
    if (_.isObject(v)) return `${indent}"${stricktK}": ${formatObject(v, depth + 1)}${comma}`;
    return `${indent}"${stricktK}": ${toString(v, '"')}${comma}`;
  });

  return `{\n${lines.join('\n')}\n${closingIndent}}`;
};

const formatArray = (arr, depth) => {
  const indent = ' '.repeat((depth + 1) * 2);
  const closingIndent = ' '.repeat(depth * 2);

  const lines = arr.map((v, i) => {
    const comma = i === arr.length - 1 ? '' : ',';
    if (_.isArray(v)) return `${indent}${formatArray(v, depth + 1)}${comma}`;
    if (_.isObject(v)) return `${indent}${formatObject(v, depth + 1)}${comma}`;
    return `${indent}${toString(v, '"')}${comma}`;
  });

  return [`\n${lines.join('\n')}\n${closingIndent}`];
};
/* eslint-enable no-use-before-define */

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

export const json = (tree, depth = 0) => {
  const indent = ' '.repeat(depth * 2);
  const childIndent = ' '.repeat((depth + 1) * 2);

  const lines = tree.flatMap((node, index, array) => {
    const isLast = index === array.length - 1;
    const comma = isLast ? '' : ',';
    const key = String(node.key)
    switch (node.type) {
      case 'nested':
        return `${childIndent}"${key}": ${json(node.children, depth + 1)}${comma}`;
      case 'added':
      case 'updated':
      case 'unchanged': {
        const v = node.value ?? node.newValue;
        if (_.isArray(v)) {
          return `${childIndent}"${key}": ${formatArray(v, depth + 1)}${comma}`;
        }
        if (_.isObject(v)) {
          return `${childIndent}"${key}": ${formatObject(v, depth + 1)}${comma}`;
        }
        return `${childIndent}"${key}": ${toString(v, '"')}${comma}`;
      }
      case 'removed':
      default:
        return [];
    }
  });

  return `{\n${lines.join('\n')}\n${indent}}`;
};
