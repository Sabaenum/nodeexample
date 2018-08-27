var express = require('express');
var app = express();
var mongoose = require('mongoose');

var Rest = require('connect-rest');
var vhost = require('vhost');
var credentials = require('./credentials.js');

var handlebars = require('express3-handlebars')
    .create({defaultLayout:'main',
        helpers: { section: function (name, options) {
            if(!this._sections) this._sections = {};
            this._sections[name] = options.fn(this);
            return null;
        }
    }
    });

var opts = {
    server: {
        socketOptions: { keepAlive: 1 }
    }
};
app.use('/api', require('cors')());


switch(app.get('env')){
    case 'development':
        mongoose.connect(credentials.mongo.development.connectionString, opts);
        break;
    case 'production':
        mongoose.connect(credentials.mongo.production.connectionString, opts);
        break;
    default:
        throw new Error('Unknown execution environment: ' + app.get('env'));
}

var autoViews = {};
var fs = require('fs');

app.engine('handlebars', handlebars.engine);

app.set('view engine', 'handlebars');

app.set('port', process.env.PORT || 3000 );

app.use(require('body-parser')());

app.use(express.static(__dirname + '/source'));

app.use(express.static(__dirname + '/vendor'));

app.use(express.static(__dirname + '/qa'));

app.use(require('cookie-parser')(credentials.cookieSecret));

app.use(require('express-session')());

app.use(function (req, res, next) {
    res.locals.showTests = app.get('env') !== 'production' && req.query.test === '1';
    next();
});

var apiOptions = {
    context: '/',
    domain: require('domain').create(),
};
var rest =  Rest.create( apiOptions );
app.use(vhost('api.*', rest.processRequest()));

app.use(function (req, res, next) {
   res.locals.flash = req.session.flash;
   delete req.session.flash;
   next();
});
apiOptions.domain.on('error', function(err){
    console.log('API domain error.\n', err.stack);
    setTimeout(function(){
        console.log('Server shutting down after API domain error.');
        process.exit(1);
    }, 5000);
    server.close();
    var worker = require('cluster').worker;
    if(worker) worker.disconnect();
});

/* Route to handlebars id we didn't found route in  Route.js */

app.use(function(req,res,next){
    var path = req.path.toLowerCase();
    console.log(path);

    if(autoViews[path]) return res.render(autoViews[path]);

    if(fs.existsSync(__dirname + '/views' + path + '.handlebars')){
        autoViews[path] = path.replace(/^\//, '');
        return res.render(autoViews[path]);
    }
    if(fs.existsSync(__dirname + '/views' + path + '.html')){
        autoViews[path] = path.replace(/^\//, '');
        return res.render(autoViews[path]);
    }

    next();
});

require('./routes.js')(app,rest);

/* 404 page */

app.use(function (req, res) {
    res.status(404);
    res.render('404');
});

/* 500 page */

app.use(function (err,req,res,next) {
    console.error(err.stack);
    res.type('text/plain');
    res.status(500);
    res.send('500 - Server Error');
});

app.listen(app.get('port'), function(){
    console.log( 'Express started in ' + app.get('env') +
        ' mode on http://localhost:' + app.get('port') +
        '; press Ctrl-C to terminate.' );
});

