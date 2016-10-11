#!/usr/bin/env node
var program = require('commander');

program
  .version('0.0.1')
  .usage('[options] <file ...>')
  .parse(process.argv);

var dust = require('dustjs-linkedin');
