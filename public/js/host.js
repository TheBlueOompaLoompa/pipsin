async function pickNewGame(gameBox){
    document.getElementById("start_button").style.visibility = "hidden";
    let gameListDownloadURL = await storage.ref('/games/games.csv').getDownloadURL();
    var xhr = new XMLHttpRequest();
    xhr.responseType = "text";
    xhr.onload = async function(event) {
        var gameList = xhr.response.replace('\n', '').split(',');
        console.log(gameList);
        const gameName = gameList[Math.floor(Math.random() * gameList.length)]; // Set game name
        await database.ref(`/games/${gameId}`).child('game').set(gameName);
        await database.ref(`/games/${gameId}`).child('state').set('playing');

        let gameHTMLURL = await storage.ref(`/games/${gameName}/host.html`).getDownloadURL();
        let gameJavaScriptURL = await storage.ref(`/games/${gameName}/host.js`).getDownloadURL();
        var script = document.createElement('script');
        
        script.onload = function(){ // When the script loads download the HTML
            var xhr = new XMLHttpRequest();
            xhr.responseType = "text";
            xhr.onload = function(event) { // When the HTML loads show the game and execute it
                const pageData = xhr.response;
                gameBox.innerHTML = pageData;
                execute(); // Start the game
                return;
            };
            xhr.open('GET', gameHTMLURL);
            xhr.send(); // Start download
        }
        script.src = gameJavaScriptURL;
        document.getElementById('gameStatus').appendChild(script); // Load the host game script
    };
    xhr.open('GET', gameListDownloadURL);
    xhr.send();
}