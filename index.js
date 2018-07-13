var http = require('http');
var fs =require('fs');


function serverStaticFile(res, path, contentType, responseCode) {
        if(!responseCode) responseCode = 200;
        fs.readFile(__dirname + path, function (err, data) {
                if(err){
                        res.writeHead(500, {' Content-type' : 'text/plain'});
                        res.end(' 500 - Internal Error')
                } else {
                        res.writeHead(responseCode,
                            { 'Content-type' : contentType });
                        res.end(data);
                }
        });
}

http.createServer(function (req, res) {
        var path = req.url.replace(/\/?(?:\?.*)?$/,'').toLowerCase();
        switch (path){
            case '':
                serverStaticFile(res, '/source/pages/home.html', 'text/html');
                break;
            case '/about' :
                serverStaticFile(res, '/source/pages/about.html', 'text/html');
                break;
            default :
                serverStaticFile(res, '/source/pages/404.html', 'text/html', 404);
                break;
        }
}).listen(3000);
console.log('Server Start');
