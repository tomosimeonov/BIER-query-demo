/**
 * New node file
 */

var fs = require('fs');
var generator = require('../UI/generator');
var path = require('path');

console.log("Creating index.html")
fs.writeFile(path.normalize(__dirname + '/udp/index.html'), generator.generate(path.resolve(__dirname,
		'../UI/conf.default.json')), function(a){});