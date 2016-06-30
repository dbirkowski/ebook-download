"use strict";
var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var path = require('path');
var http = require('http');
const MAIN_URL = 'http://english.htu.cn/ePub.html';
console.info('starting...');
request(MAIN_URL, function (error, response, content) {
    console.info('request handled');
    if (!error) {
        let $ = cheerio.load(content);
        let authors = $('div > ul > li').slice(2);
        let data = authors.map((i, el) => {
            let $author = $(el);
            let name = $author.text();

            let books = $author.next().find('li a');
            books = books.map((i, el) => {
                return {
                    name: getName($(el))
                    , href: $(el).attr('href')
                }
            });

            return {
                name
                , books
            }
        });

        downloadBooks(data);
    }
});

function downloadBooks(data) {
    data.each((i, el) => {
        let author = el.name;
        let books = el.books;
        mkdirSync(author);

        books.each((i, el) => {
            download(el.href, getPath(author, el.name));
        });
    });
}

function getName(name) {
    let text = name.text();
    if (text.indexOf(', The') > -1) {
        text = 'The ' + text.replace(', The', '');
    }
    return text;
}

function getPath(folder, file) {
    return './' + folder + '/' + file + '.epub';
}

function mkdirSync(path) {
    try {
        fs.mkdirSync(path);
    } catch (e) {
        if (e.code != 'EEXIST') throw e;
    }
}

function download(url, dest, cb) {
    fs.access(dest, fs.F_OK, (err) => {
        if (err) {
            console.log('downloading ' + dest);

            let file = fs.createWriteStream(dest);
            let request = http.get(url, function (response) {
                response.pipe(file);
                file.on('finish', function () {
                    console.log('finished ' + dest);
                    file.close(cb); // close() is async, call cb after close completes.
                });
            }).on('error', function (err) { // Handle errors
                fs.unlink(dest); // Delete the file async. (But we don't check the result)
                if (cb) cb(err.message);
            });
        }
    });
};