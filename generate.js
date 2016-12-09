#!/usr/bin/env node
var program = require('commander');
var readline = require('readline');
var fs = require('fs');
var dust = require('dustjs-linkedin');
var QRCode = require("qrcode-svg");

dust.config.whitespace = true;

// This script extracts some identifiers from the available list (data/available-ids)

var generationDir = './tmp';
var baseUrl = '../../';

program
    .version('0.0.1')
    .usage('[options] ')
    .option('-i, --id [card-id]', 'Generate this cardId', null)
    .option('-c, --cards [amount]', 'Set the amount of cards you want to generate [100]', '100')
    .parse(process.argv);

var amount = program.cards;
var cardId = program.id;

// load dust template
var src = fs.readFileSync('./data/template-card.html', 'utf8');
var compiled = dust.compile(src, 'card');
dust.loadSource(compiled);

var oneliners = fs.readFileSync('./data/oneliners', {encoding: 'utf8'}).split('\n');
function getRandomOneliner() {
    var max = oneliners.length;
    return oneliners[Math.round(Math.random() * max)];
}


function renderId(id) {

    appendGeneratedId(id);

    var dir = generationDir + '/' + id;
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }

    generateQr(dir, id);

    dust.render('card',
        {
            id: id,
            baseUrl: baseUrl,
            message: getRandomOneliner()
        },
        function (err, out) {
            // `out` contains the rendered output.
            fs.writeFileSync(dir + '/index.html', out, {flag: 'w'});
        });

}

function generateQr(dir, id) {
    var qrcode = new QRCode({
        content: "http://projectsmile.com/" + id.toUpperCase(),
        width: 100,
        height: 100,
        color: "#000000",
        background: "#ffffff",
        ecl: "M"
    });

    qrcode.save(dir + '/qr.svg', function (error) {
        if (error) {
            console.log('Error generating QR code for ID ' + id + ': ' + error);
        }
    });
}

var writeStream = fs.createWriteStream('./data/generated-ids', {flags: 'a'});
function appendGeneratedId(id) {
    if (!fs.existsSync(generationDir + '/' + id + '/index.html')) {
        writeStream.write("\n");
        writeStream.write(id);
    }
}

if (cardId) {
    console.log('Going to generate card with ID ' + cardId);
    renderId(cardId);
} else {

    console.log('Going to generate ' + amount + ' cards...');
// read file
    var rl = readline.createInterface({
        input: fs.createReadStream('./data/available-ids')
    });

    var newAvailableFileStream = fs.createWriteStream('./data/available-ids.new', 'utf8');

    var lineCount = 0;
    rl.on('line', function (input) {
        lineCount++;
        if (lineCount > amount) {
            if (lineCount - amount > 1) {
                newAvailableFileStream.write('\n');
            }
            newAvailableFileStream.write(input);
        } else {
            renderId(input);
        }
    });

    rl.on('close', function () {
        writeStream.close();
    });
}