suite('"About" Page Test', function () {
   test('page should be contain link to contact page', function () {
       assert($('a[href="/contact"]').length);
   });
});