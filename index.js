#!/usr/bin/env node

var _ = require("lodash");
var fs = require("fs");

var url = require("./src/url");
var Crawler = require("./src/crawler");

var args = process.argv.slice(2);
var href = args[0];
var filename = args[1];

if (!href || !filename) {
  console.log("Usage: node index [URL] [filename]");
  process.exit(1);
}

var domain = url.parse(href).hostname;

fs.open(filename, 'w', function(error, fd) {

  if (error) return console.error(error);

  var crawler = (new Crawler({ domain: domain, url: href }))
    .on("add", function(page) {
      console.log("added:", page.url);
    })
    .on("error", function(error) {
      console.error(error);
    })
    .on("done", function(pages) {
      console.log("\ndone.\n");
      fs.write(fd, JSON.stringify(pages));
    });

});
