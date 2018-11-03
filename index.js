const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const molecules = require('./molecule.json');

let players = {};
const game = {
    currentMolecule: undefined,
};

app.use('/resources', express.static('frontend/resources'));
app.use('/images', express.static('images'));
app.use('/sound', express.static('sound'));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/frontend/index.html');
});

app.get('/play', function(req, res){
    res.sendFile(__dirname + '/frontend/client.html');
});

app.get('/host', function(req, res){
    res.sendFile(__dirname + '/frontend/host.html');
});

io.on('connection', function(socket) {
    socket.on('start', function() {
        socket.emit('setplayers', players);
        game.currentMolecule = randomMolecule();
        io.emit('startmolecule', game.currentMolecule);
        console.log('starting game', game.currentMolecule);
    });
    socket.on('player-ready', function(name) {
        players[socket.id] = {
            id: Object.keys(players).length + 1,
            name: name,
            score: 0
        };
        socket.emit('added-player', players[socket.id].name);
        if (game.currentMolecule) {
            console.log(game.currentMolecule);
            socket.emit('startmolecule', game.currentMolecule);
        }
        io.emit('setplayers', players);
        console.log('player added:', players[socket.id].name);
    });
    socket.on('done', function() {
        const player = players[socket.id];
        player.score++;
        io.emit('setplayers', players);
        io.emit('playerpoint', players[socket.id].name);
        setTimeout(function() {
            game.currentMolecule = randomMolecule();
            io.emit('startmolecule', game.currentMolecule);
        }, 1000);
    });

    socket.on('disconnect', function() {
        delete players[socket.id];
    });
});

http.listen(8097, function(){
    console.log('listening on localhost:8097');
});



function randomMolecule() {
    return molecules[Math.floor(Math.random()*molecules.length)];
}
