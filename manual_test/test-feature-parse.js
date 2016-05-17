#!/usr/bin/env node

var featureParse = require('../feature-parse.js');

featureParse(
  'lib/jquery',
  'lib/jquery/src/traversing/var/siblings.js',
  {}
);
