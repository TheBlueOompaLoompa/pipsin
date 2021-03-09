let roomRef;
let selfRef;

async function joinRoom(id, name, uid){
    let successful = false;
    console.log({id, name, uid});
    let snapshot = await database.ref(`/games/${id}`).get()
    if(snapshot.exists()){
        console.log("Game exists");
        var playerData = {
            name,
        }

        var updates = {};
        updates[`/players/${id}/${uid}`] = playerData;

        let selfRef = database.ref(`/players/${id}/${uid}`);
        await database.ref().update(updates)

        document.getElementById('gameManageInput').style = "visibility: hidden;";
        successful = true;
        console.log("Successful: ", successful);
        selfRef.onDisconnect().remove((err)=> {
            if (err) {
                console.error('could not establish onDisconnect event', err);
            }
        });
    }else{
        alert(`That game doesn't exist!`);
    }
    return successful;
}

function createRoom(){
    const currentTime = Date.now();
    const id = currentTime.toString().substr(6, currentTime.toString().length);
    let playerList = document.getElementById('playernames');
    
    roomRef = database.ref('/games/' + id)
    roomRef.set({
        createdAt: currentTime,
        creator: userId,
        players: []
    }).then(e => {
        document.getElementById('gameManageInput').style.visibility = "hidden";
        roomRef.onDisconnect().remove((err)=> {
            if (err) {
                console.error('could not establish onDisconnect event', err);
            }
        });
    }).catch(error => {
        console.log(error);
    });

    let playersRef = database.ref(`/players/${id}`);

    playersRef.on('child_added', snapshot => {
        const playerAddedData = snapshot.val();

        let nameNode = document.createElement('span');
        nameNode.innerText = playerAddedData.name;
        nameNode.className = 'white';
        nameNode.id = snapshot.key;

        let linebreak = document.createElement('br');

        playerList.prepend(linebreak);
        playerList.prepend(nameNode);
        console.log(playerAddedData);
    });

    playersRef.on('child_removed', snapshot => {
        let playerListChildren = playerList.children;
        for(let i = 0; i < playerListChildren.length; i++){
            if(playerListChildren[i].id == snapshot.key){
                playerList.removeChild(playerListChildren[i]);
            }
        }
    });

    return id;
}

function closeRoom(){
    roomRef.remove();
}