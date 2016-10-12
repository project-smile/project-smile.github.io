#!/usr/bin/env node
var program = require('commander');
var readline = require('readline');
var fs = require('fs');
var dust = require('dustjs-linkedin');
dust.config.whitespace = true;

// This script extracts some identifiers from the available list (data/available-ids)

var generationDir = './tmp';
var baseUrl = '../../';

program
  .version('0.0.1')
  .usage('[options] ')
  .option('-c, --cards [amount]', 'Set the amount of cards you want to generate [100]', '100')
  .parse(process.argv);

var amount = program.cards;
console.log('Going to generate ' + amount + ' cards...');

// load dust template
var src = fs.readFileSync('./data/template-card.html', 'utf8');
var compiled = dust.compile(src, 'card');
dust.loadSource(compiled);


function renderId(id) {
  dust.render('card', { id: id, baseUrl: baseUrl }, function(err, out) {
    // `out` contains the rendered output.
    var dir = generationDir + '/' + id;
    if (!fs.existsSync(dir)){
      fs.mkdirSync(dir);
    }
    fs.writeFileSync(dir + '/index.html', out, {flag: 'w'});
  });
}

// read file
var rl = readline.createInterface({
  input: fs.createReadStream('./data/available-ids')
});

var writeStream = fs.createWriteStream('./data/generated-ids', {flags: 'a'});
var lineCount = 0;
rl.on('line', function(input) {
   lineCount++;
   if (lineCount > amount) {
    writeStream.write(input);
    writeStream.write("\n");
  } else {
    renderId(input);
  }
});

rl.on('close', function() {
  writeStream.close();
});
