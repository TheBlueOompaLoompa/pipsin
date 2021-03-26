const rounds = 5;

function timer(time, callback){
    return new Promise((resolve, reject) => {
        let val = time;
        let countdown = setInterval(function(){
            callback(val);
            val--;
            if(val == 0){
                clearInterval(countdown);
                resolve();
            }
        }, 1000);
    });
}

async function execute(){
    let counter = document.getElementById("counter");
    await timer(10, function(time){
        counter.innerText = `Starting in ${time}`;
    });
    counter.style.visibility = 'hidden';
}