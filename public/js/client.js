async function setupClientHooks(id, gameBox){
    let gameStateRef = database.ref(`/games/${id}/state`);
    gameStateRef.on('value', async function(snapshot){
        const data = snapshot.val();
        if(data == 'playing'){
            database.ref(`/games/${id}`).child('game').get().then(async function(snapshot){
                const gameName = snapshot.val();
                console.log(gameName)
                let gameHTMLURL = await storage.ref(`/games/${gameName}/client.html`).getDownloadURL();
                let gameJavaScriptURL = await storage.ref(`/games/${gameName}/client.js`).getDownloadURL();
                var script = document.createElement('script');
                
                script.onload = function(){ // When the script loads download the HTML
                    var xhr = new XMLHttpRequest();
                    xhr.responseType = "text";
                    xhr.onload = (event) => { // When the HTML loads show the game and execute it
                        const pageData = xhr.response;
                        gameBox.innerHTML = pageData;
                        execute(); // Start the game
                        return;
                    };
                    xhr.open('GET', gameHTMLURL);
                    xhr.send(); // Start download
                }
                script.src = gameJavaScriptURL;
                document.getElementById('gameStatus').appendChild(script); // Load the client game script
            });
            
        }
    });
}