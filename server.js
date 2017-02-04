/**
 * Created by josephcauble on 2/4/17.
 */
var express = require('express');
var httpProxy = require('http-proxy');

var apiForwardingUrl

var server = express();
server.set('port', 3000);
server.use(express.static(__dirname + '/app'));

server.listen(server.get('port'), function() {
    console.log('Express server listening on port ' + server.get('port'));
});