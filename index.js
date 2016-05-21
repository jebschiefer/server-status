'use strict';

const execFile = require('child_process').execFile;
const http = require('http');
const parallel = require('async/parallel');

const config = require('./config');

const PORT = config.port || 3000;

const server = http.createServer((request, response) => {
  parallel({
    df: (callback) => {
      execCommand('df', ['-lh'], callback);
    },

    pm2: (callback) => {
      execCommand('pm2', ['list', '--no-color'], callback);
    },
  }, (error, results) => {
    if (error) {
      console.error(error);
      response.writeHead(500, { 'Content-Type': 'text/plain' });
      return response.end(`${error}\n`);
    }

    const pm2 = results.pm2.replace('\n Use `pm2 show <id|name>` to get more details about an app\n', '');

    const body = JSON.stringify({
      filesystem: results.df,
      app: pm2,
    });

    response.writeHead(200, { 'Content-Type': 'application/json' });
    return response.end(body);
  });
});

server.listen(PORT);

console.log(`Server is running at http://localhost:${PORT}`);

function execCommand(cmd, args, callback) {
  execFile(cmd, args, (error, stdout, _stderr) => {
    if (error) {
      return callback(error);
    }

    return callback(null, stdout);
  });
}
