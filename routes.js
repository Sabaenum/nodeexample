var main = require('./handlers/main.js');
var multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null,file.originalname)
    }
});
var upload = multer({ storage: storage });

module.exports = function (app,rest) {
    app.get('/', main.home);
    app.get('/about', main.about);
    app.get('/contest/vacation-photo', main.vacationPhoto);
    app.post('/contest/vacation-photo/:year/:month', main.contextPhoto);
    app.post('/upload', upload.single('photo'), function (req, res) {
    });
    app.get('/tours/hood-river', main.hoodRiver);
    app.get('/tours/request-group-rate', main.requestGroupRate);
    app.get('/newsletter', main.newletter);
    app.post('/process', main.process);
    app.get('/vacations', main.vacation);
    rest.get('/api/attractions', main.getAtraction);
    rest.post('/api/attractions', main.postAtraction);
    rest.get('/api/attraction/:id', main.getAtractionById);
};