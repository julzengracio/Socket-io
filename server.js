//server
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

app.use(express.static(__dirname + '/public'));
//redirect to index.html file

app.get('/', function(req, res, next){
    res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', function(client){
    // notify the console that a client has connected.
    console.log('client connected');
    
    // when a client disconnects...
    client.on('disconnect', function(){
        // ...output a message to the console that a user has disconnected.
        console.log('client disconnected');
    });
    
    io.clients(function(error, clients){
       if(error) throw error;
        io.emit('clientLists', clients);
    });
    
    // Recieves and store the message sent from all clients.
    client.on('chatMessage', function(msg){
        // Send back the message to the client.
        io.emit('chatMessage', msg);
    });
    
    // Recieve and store the ID of a client and the message sent from a client.
    client.on('clientClicked', function(id, msg){
        // Send the message back to a specific client.
        io.to(id).emit('youWereClicked', msg);
    });
});


//web server and socket.io server listening
server.listen(3000, function(){
    console.log('listening on *:3000');
});