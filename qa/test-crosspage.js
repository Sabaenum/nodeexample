var Browser = require('zombie'),
    assert = require('chai').assert;

var browser;

suite('Cross Page Test', function () {
    setup(function () {
        browser = new Browser();
    });
    this.timeout(5000);
    test('requesting a group rate quote', function (done) {
        var referrer = 'http://192.168.33.77:3000/tours/hood-river';
        browser.visit(referrer,function () {
            browser.clickLink('.requestGroupRate', function () {
                browser.assert.element('form input[name=referrer]',referrer);
                done();
            });
        });
    });
    test('request group oregon',function (done) {
        var referrer = 'http://192.168.33.77:3000/tours/orego-coast';
        browser.visit(referrer,function () {
            browser.clickLink('.requestGroupRate',function () {
                browser.assert.element('form input[name=referrer]' , referrer);
                done();
            });
        });
    });
    test('visiting request group rate page', function (done) {
        var referrer = 'http://192.168.33.77:3000/tours/request-group-rate';
        browser.visit(referrer,function () {
                assert(browser.field('referrer').value === '');
            done();
        })
    })
});

