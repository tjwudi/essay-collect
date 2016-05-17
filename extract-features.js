#!/usr/bin/env node
'use strict'

const minimist = require('minimist');
const findit = require('findit');
const assert = require('assert');
const featureParse = require('./feature-parse');

const args = minimist(process.argv.slice(2));

assert(args._.length > 0);

const repoPath = args._[0];
const finder = findit(repoPath);

finder.on('file', function (file, stat) {
  if (!/\.js$/.test(file)) {
    return;
  }
  featureParse(repoPath, file, stat);
});
