var nodemailer = require('nodemailer');

module.exports = function (credentials) {

    var mailTransport = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: credentials.gmail.user,
            pass: credentials.gmail.pass
        }
    });
    var from = '"Meadowlark Travel" <info@meadowlark.com>';
    var errorRecipient = "godoftaste77@gmail.com";

    return {
        send: function (to, subject, body) {
            mailTransport.sendMail({
                from: from,
                to: to,
                subject: subject,
                html: body,
                generateTextFromHtml: true
            }, function (err) {
                if (err) console.error('Unable to send email ' + err);
            });
        },
        emailError: function (message, filename, exception) {
            var body = '<h1>Meadowlark TravelSite Error</h1>Message:<br><pre>'+ message+'</pre><br>';
            if(exception) body += 'Exception:<br>><pre>'+exception+'</pre><br>';
            if(filename) body += 'Filename: <br><pre>'+filename+'</pre><br>';
            mailTransport.sendMail({
                from: from,
                to: errorRecipient,
                subject: 'Meadowlark TravelSite Error',
                html: body,
                generateTextFromHtml: true
            }, function (err) {
                    if (err) console.error('Unable to send email ' + err);
                });
        },
    }

};


