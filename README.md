# server-status

A lightweight Node.js server to report the status of a server. This should be run behind a reverse proxy with authentication if you don't want the world to see this information.

### Usage
```
$ npm start
```

### Behavior
Reponds to any HTTP request with JSON data conaining the output of `df -lh` and `pm2 list --no-color`.
