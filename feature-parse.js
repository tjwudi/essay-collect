'use strict';

const acorn = require('acorn');
const walk = require('acorn/dist/walk');
const git = require('nodegit');
const fs = require('fs');
const escomplex = require('escomplex-js');
const crypto = require('crypto');
const model = require('./model');
const Record = model.Record;

module.exports = function featureParse (repoPath, file, stat) {
  const relativePath = file.replace(repoPath, '');
  const code = fs.readFileSync(file).toString();
  let ast = null;
  try {
    ast = acorn.parse(code);
  }
  catch(e) {
    return;
  }
  walk.simple(ast, {
    FunctionExpression: function (funcExp) {
      _parseFunc(funcExp, code, repoPath, relativePath);
    }
  });
  return ast;
};


function _parseFunc(
    funcExp,
    code,
    repoPath,
    relativePath) {
  let funcCode = code.slice(funcExp.start, funcExp.end);
  funcCode = 'var t = ' + funcCode;

  const options = {
    logicalor : true,
    switchcase : true,
    forin : false,
    trycatch : false,
    newmi : true
  };
  let report = null;
  try {
    report = escomplex.analyse(funcCode, options);
  }
  catch(e) {
    return;
  }
  const signature = getSHA1(JSON.stringify(report) + getSHA1(funcCode));
  const newRecord = new Record({
    signature: signature,
    funcCode: funcCode,
    repo: repoPath,
    physical_loc: report.aggregate.sloc.physical,
    logical_loc: report.aggregate.sloc.logical,
    number_of_params: report.aggregate.params,
    maintainability: report.maintainability,
    cyclomatic: report.cyclomatic,
    cyclomatic_density: report.aggregate.cyclomaticDensity,
    operators_total: report.aggregate.halstead.operators.total,
    operators_distinct: report.aggregate.halstead.operators.distinct,
    operands_total: report.aggregate.halstead.operands.total,
    operands_distinct: report.aggregate.halstead.operands.distinct
  });

  newRecord.save(function (err) {
    if (err) {
      return console.log(`Failed to save ${signature}`);
    }
    console.log(`Saved ${signature}`);
  });
}


function getSHA1(input) {
  return crypto.createHash('sha1').update(input).digest('hex');
}
