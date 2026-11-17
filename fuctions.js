function dectectCollison(a, b){
    return(
        a.attackBox.position.x + a.attackBox.width >= b.position.x &&
        a.attackBox.position.x <= b.position.x + b.width &&
        a.attackBox.position.y + a.attackBox.height >= b.position.y &&
        a.attackBox.position.y <= b.position.y + b.height
    )
}

function determineWinner(player, ememy, timerId){
    clearTimeout(timerId);
    if(player.health === ememy.health){
        document.getElementById('myResults').innerHTML = 'Tie';
    }
    else if(player.health > ememy.health){
        document.getElementById('myResults').innerHTML = 'Player 1 Wins';
    }
    else if(player.health < ememy.health){
        document.getElementById('myResults').innerHTML = 'Player 2 Wins';
    }
    document.getElementById('myResults').style.display = 'flex';
}

let timer = 60;
let timerId;
function decreaseTimer(){
    if(!(timer === 0)){
        timerId = setTimeout(decreaseTimer, 1000);
        timer--
        document.getElementById('myTimer').innerHTML = timer;
    }

    if(timer === 0){
        determineWinner(player, ememy, timerId);
    }
}