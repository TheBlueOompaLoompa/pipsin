async function pickNewGame(){
    let gameListDownloadURL = await storage.ref('/games/games.csv').getDownloadURL();
    var xhr = new XMLHttpRequest();
    xhr.responseType = "text";
    xhr.onload = (event) => {
        var gameList = xhr.response.replace('\n', '').split(',');
        console.log(gameList);
        database.ref(`/games/${gameId}`).child('game').set(gameList[Math.floor(Math.random() * gameList.length)]);
        return;
    };
    xhr.open('GET', gameListDownloadURL);
    xhr.send();
}