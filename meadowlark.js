var express = require('express');
var app = express();
var multer  = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '/uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now())
    }
});

var upload = multer({ storage: storage });

var formidable = require('formidable');
var handlebars = require('express3-handlebars')
    .create({defaultLayout:'main',
        helpers: { section: function (name, options) {
            if(!this._sections) this._sections = {};
            this._sections[name] = options.fn(this);
            return null;
        }
    }
    });

app.engine('handlebars', handlebars.engine);

app.set('view engine', 'handlebars');

app.set('port', process.env.PORT || 3000 );

app.use(require('body-parser')());

app.use(express.static(__dirname + '/source'));

app.use(express.static(__dirname + '/vendor'));

app.use(express.static(__dirname + '/qa'));


app.use(function (req, res, next) {
    res.locals.showTests = app.get('env') !== 'production' && req.query.test === '1';
    next();
});

app.get('/contest/vacation-photo', function (req,res) {
    var now = new Date();
    res.render('contest/vacation-photo',{ year: now.getFullYear(), month: now.getMonth() });
});

app.post('/contest/vacation-photo/:year/:month', function (req,res) {
    var form = new formidable.IncomingForm();
    form.parse(req,function (err, fields, files) {
        if(err) return res.redirect(303, 'error');
        console.log('received Fields');
        console.log(fields);
        console.log('received Files');
        console.log(files);
        res.redirect(303, 'thank-you');
    });
});
var upload = multer().single('avatar')
app.post('/upload', function (req, res) {
    upload(req, res, function (err) {
        if (err) {
            // An error occurred when uploading
            return
        }

        // Everything went fine
    })
});

app.get('/', function (req, res) {
   res.render('home');
});

app.get('/about',function (req, res) {
    res.render('about',
        {pageTestScript: '/test-about.js'});
});

app.get('/tours/hood-river',function (req, res) {
    res.render('tours/hood-river');
});

app.get('/tours/request-group-rate',function (req, res) {
    res.render('tours/request-group-rate');
});

app.get('/newsletter', function (req,res) {
    res.render('newsletter', {csrf: "CSFR token goes here"});
});

app.post('/process', function (req,res) {
    console.log('Form from query string' + req.query.form );
    console.log('Form from hidden' + req.body.csfr);
    console.log('Form from visible name' + req.body.name );
    console.log('Form Email' + req.body.email );
    res.redirect(303, '/thank-you');
});

app.use(function (req, res) {
    res.status(404);
    res.render('404');
});

app.use(function (err,req,res,next) {
    console.error(err.stack);
    res.type('text/plain');
    res.status(500);
    res.send('500 - Server Error');
});

app.listen(app.get('port'), function () {
    console.log('express shared' +
    app.get('port') + '; press');
});
if(app.thing == null ) console.log('bleat!');