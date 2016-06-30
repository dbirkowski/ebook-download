var request = require('request');
var cheerio = require('cheerio');
const MAIN_URL = 'http://english.htu.cn/ePub.html';
console.info(MAIN_URL);
request(MAIN_URL, function (error, response, content) {
    console.info('request works');
    if (!error) {
        let $ = cheerio.load(content);
        let authors = $('div > ul > li').slice(2);

        //        var f = $(authors[0]);
        //        console.log(f.text());

        authors.each(function (el) {
            let name = $('i', el);
            console.log(name.text());
        });

        //            let books = el.next('ul').find('li a');
        //            books = books.map(function (el) {
        //                return {
        //                    name: el.text()
        //                    , href: el.attr('href')
        //                }
        //            });
        //            return {
        //                name: name
        //                , books: books
        //            }
        //        });
        //        console.info(authors);
    }
});


//var http = require('http');
//var fs = require('fs');
//
//var download = function(url, dest, cb) {
//  var file = fs.createWriteStream(dest);
//  var request = http.get(url, function(response) {
//    response.pipe(file);
//    file.on('finish', function() {
//      file.close(cb);  // close() is async, call cb after close completes.
//    });
//  }).on('error', function(err) { // Handle errors
//    fs.unlink(dest); // Delete the file async. (But we don't check the result)
//    if (cb) cb(err.message);
//  });
//};

//var fs    = require('fs')
//  , path  = require('path');
//
//var mkdirSync = function (path) {
//  try {
//    fs.mkdirSync(path);
//  } catch(e) {
//    if ( e.code != 'EEXIST' ) throw e;
//  }
//}

//var authors = Array.apply(null , document.querySelectorAll('div > ul > li')).slice(2);
//var authorWithBooks = authors.map(function(el) {
//    var name = el.textContent;
//    var books = Array.apply(null , el.nextElementSibling.querySelectorAll('li a'));
//    books = books.map(function(el) {
//        return {
//            name: el.textContent,
//            href: el.href
//        }
//    });
//    return {
//        name: name,
//        books: books
//    }
//});