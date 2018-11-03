const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const molecules = require('./molecule.json');

let players = {};
const game = {
    currentMolecule: {},
};

app.get('/', function(req, res){
    res.sendFile(__dirname + '/frontend/index.html');
});

io.on('connection', function(socket) {
    socket.on('start', function() {
        game.currentMolecule = randomMolecule();
        socket.emit('startmolecule', game.currentMolecule);
    });
    socket.on('player-ready', function() {
        players[socket.id] = {
            id: Object.keys(players).length + 1,
            score: 0
        };
        socket.emit('added-player', players[socket.id].id);
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
