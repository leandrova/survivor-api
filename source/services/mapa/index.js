var express = require('express');
var app = express();

app.get('/mapa', function(req, res) {
    res.send('mapa');
});