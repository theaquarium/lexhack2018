const moleculeDrawing = SVG('moleculedisplay').size('100%', '100%');

const socket = io('http://10.61.25.113:8097/');
socket.emit('player-ready');
socket.on('added-player', function(id) {
    document.getElementById('playerid').textContent = id.toString();
});

socket.on('startmolecule', function(molecule) {
    document.getElementById('moleculedisplay') = molecule.formula;
    var circle = moleculeDrawing.circle(100);
});

