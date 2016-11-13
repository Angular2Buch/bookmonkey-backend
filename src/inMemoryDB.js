'use strict';

/**
 * before this we used 'simple-node-db', which has a classic callback-driven API
 * everything is synchronous now, but let's keep the old API for future use
 */

var _ = require('lodash'),
    initial = require('./initialData');

var allBooks = {};

// isbn is normalized to ensure more accurate results
var normalizeIsbn = function (isbn) {
    return isbn.replace(/\s|-/gi, '');
}

/***************************************/

exports.getAllBooks = function (callback) {

    var sortedArry = _(allBooks)
        .values()
        .sortBy(function (b) { return b.isbn })
        .reverse()
        .value();

    callback(false, sortedArry)
};

exports.getBookByISBN = function (isbn, callback) {
    var isbn = normalizeIsbn(isbn);
    callback(false, allBooks[isbn]);
};

exports.isbnExists = function (isbn, callback) {
    var isbn = normalizeIsbn(isbn);
    callback(false, allBooks.hasOwnProperty(isbn));
};

exports.createBook = function (book, callback) {
    if (!book) return callback(new Error('No record given'));

    if (!book.rating)    book.rating = 3; // set rating to average
    if (book.rating < 1) book.rating = 1; // set rating minimum
    if (book.rating > 5) book.rating = 5; // set rating maximum

    var isbn = normalizeIsbn(book.isbn);
    allBooks[isbn] = book;
    callback(false);
};

exports.updateBook = exports.createBook;

exports.deleteBook = function (isbn, callback) {
    if (!isbn) return callback(new Error('No record given'));

    delete allBooks[isbn];
    callback(false);
};

exports.reset = function (callback) {
    allBooks = initial.get();

    callback = callback || function () { };
    callback(false);
};
