const socket = io('http://10.61.25.113:8097/');

socket.on('startmolecule', function(molecule) {
    document.getElementById('moleculename').innerHTML = molecule.name;
});

socket.emit('start');

socket.on('setplayers', function (players) {
    const playerBox = document.getElementById('scores');
    playerBox.innerHTML = "";
    Object.values(players).forEach(player => {
        const scorebox = document.createElement("span");
        scorebox.innerHTML = "<strong>Player " + player.id + "</strong><br>" + player.score;
        scorebox.className = "score";
        playerBox.appendChild(scorebox);
    });
});
