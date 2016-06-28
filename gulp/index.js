'use strict';

var env = require('node-env-file'),
	fs = require('fs'),
	tasks = fs.readdirSync('./gulp/tasks/');

env('./.env', { overwrite: true });

tasks.forEach(function(task) {
  require('./tasks/' + task);
});
