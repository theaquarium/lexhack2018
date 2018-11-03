document.getElementById('moleculedisplay').style.display = "none";
document.getElementById('rightbox').style.display = "none";
document.getElementById('leftbox').style.display = "none";
document.getElementById('point-notifier').style.display = "none";
document.getElementById('waiting').style.display = "none";

const socket = io('http://10.61.25.113:8097/');

const atoms = document.getElementsByClassName('atom');
for (let i = 0; i < atoms.length; i++) {
    atoms[i].width = document.body.clientWidth / 7.5;
    atoms[i].height = document.body.clientWidth / 7.5;
}

document.getElementById('submit-button').addEventListener('click', function(event) {
    const name = document.getElementById('username').value;
    if (name != "") {
        socket.emit('player-ready', name);
        socket.on('added-player', function(name) {
            document.getElementById('name').textContent = name;
        });

        document.getElementById('waiting').style.display = "block";
        document.getElementById('point-notifier').style.display = "none";
        document.getElementById('usernameinput').style.display = "none";
        document.getElementById('rightbox').style.display = "flex";
        document.getElementById('leftbox').style.display = "flex";
        document.getElementById('moleculedisplay').style.display = "grid";

        socket.on('playerpoint', function(playerid) {
            document.getElementById('moleculedisplay').style.display = "none";
            document.getElementById('rightbox').style.display = "none";
            document.getElementById('leftbox').style.display = "none";
            document.getElementById('point-notifier').style.display = "block";
            document.getElementById('point-notifier').innerHTML = playerid + "'s Point";
        });
        
        socket.on('startmolecule', function(molecule) {
            document.getElementById('waiting').style.display = "none";
            document.getElementById('point-notifier').style.display = "none";
            document.getElementById('usernameinput').style.display = "none";
            document.getElementById('rightbox').style.display = "flex";
            document.getElementById('leftbox').style.display = "flex";
            document.getElementById('moleculedisplay').style.display = "grid";
        
            const moleculeRows = molecule.formula.split('\n');
            const moleculedisplay = document.getElementById('moleculedisplay');
        
            moleculedisplay.innerHTML = "";
        
            let maxRowLength = 0;
            moleculeRows.forEach(row => {
                const rowSplit = row.split('');
                if (rowSplit.length > maxRowLength) maxRowLength = rowSplit.length;
            });
            moleculedisplay.style.gridTemplateRows = "repeat(" + moleculeRows.length + ", 1fr)";
            moleculedisplay.style.gridTemplateColumns = "repeat(" + maxRowLength + ", 1fr)";
            for (let rN = 0; rN < moleculeRows.length; rN++){
                const row = moleculeRows[rN];
                const rowSplit = row.split('');
                for (let eN = 0; eN < rowSplit.length; eN++) {
                    const element = rowSplit[eN];
                    if (element === " ") {
                        // lol
                    }
                    else {
                        const atomElement = document.createElement('img');
                        let name;
                        switch (element) {
                            case 'H':
                                name = "hydrogen";
                                break;
                            case 'O':
                                name = "oxygen";
                                break;
                            case 'N':
                                name = "nitrogen";
                                break;
                            case 'C':
                                name = "carbon";
                                break;
                        }
                        atomElement.src = "/images/blank.png";
                        atomElement.className = "playableatom " + name;
                        atomElement.width = moleculedisplay.clientWidth / 6;
                        atomElement.height = moleculedisplay.clientWidth / 6;
        
                        atomElement.style.cssText = `
                            grid-column: ` + (eN + 1) + ` / span 1;
                            grid-row: ` + (rN + 1) + ` / span 1;
                            justify-self: center;
                            align-self: center;
                        `;
                        moleculedisplay.appendChild(atomElement);
                    }
                };
            };
            const playableatoms = document.getElementsByClassName('playableatom');
        
            function atomAnswerClickListener(event) {
                const atomtype = event.target.className.slice(13);
                if (atomtype === activeAtom) {
                    event.target.src = "/images/" + atomtype + ".png";
                }
        
                let incorrect = false;
                for (let i = 0; i < playableatoms.length; i++) {
                    if (playableatoms[i].src.endsWith('/images/blank.png')) incorrect = true;
                }
                if (incorrect !== true) {
                    socket.emit('done');
                }
            };
        
            for (let i = 0; i < playableatoms.length; i++) {
                playableatoms[i].addEventListener('click', atomAnswerClickListener, false);
            }
        });
        
        // Click Listeners
        let activeAtom = "";
        
        const atomelements = document.getElementsByClassName('atom');
        
        const atomClickListener = function(event) {
            const atomtype = event.target.className.slice(10);
            activeAtom = atomtype;
            for (let i = 0; i < atomelements.length; i++) {
                atomelements[i].classList.remove('active');
            }
            event.target.classList.add('active');
        };
        
        for (let i = 0; i < atomelements.length; i++) {
            atomelements[i].addEventListener('click', atomClickListener, false);
        }
        
    }
});
