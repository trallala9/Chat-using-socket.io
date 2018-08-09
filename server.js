
//we need to get include our modules,files

var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
//reate two arrays one for users and for cnnections
users = [];
connections = [];
//nedd to listen to the server
server.listen(process.env.PORT || 3000);
console.log('Server running...');

//create a route like home page or dash
app.get('/', function (req, res) {
    //this gives us html
    res.sendFile(__dirname + '/index.html');
});
//connect
io.sockets.on('connection', function (socket) {
    connections.push(socket);
    console.log('Connected: %s sockets connected', connections.length);

    //disconnect 
    socket.on('disconnect', function (data) {
        //if (!socket.username) return;
        users.splice(users.indexOf(socket.username), 1);
        updateUsernames();
        connections.splice(connections.indexOf(socket), 1);
        console.log('disconnected:  %s sockets connected', connections.length);
    });
    //send message
    socket.on('send message', function (data) {
        console.log(data);
        io.sockets.emit('new message', { msg: data, user: socket.username });
    });

    socket.on('new user', function (data, callback) {
        callback(true);
        socket.username = data;
        users.push(socket.username);
        updateUsernames();
    });
    function updateUsernames() {
        io.sockets.emit('get users', users);
    }
});
