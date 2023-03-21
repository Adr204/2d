export { rectangularCollision, determineWinnder, timer, timerId, decreaseTimer }
function rectangularCollision({ rectangle1, rectangle2}) {
    return (
        rectangle1.attackBox.x + rectangle1.attackParam.width >= rectangle2.position.x && 
        rectangle1.attackBox.x <= rectangle2.position.x + rectangle2.width && 
        rectangle1.attackBox.y + rectangle1.attackParam.height >= rectangle2.position.y && 
        rectangle1.attackBox.y <= rectangle2.position.y + rectangle2.height
    )
}

function determineWinnder({player, enemy, timerId}) {
    clearTimeout(timerId);
    document.getElementById("displayText").style.display = "flex";
    if(player.health == enemy.health) {
        document.getElementById("displayText").innerHTML = "Tie";
    } else if(player.health > enemy.health) {
        document.getElementById("displayText").innerHTML = "Player 1 Wins";
    } else if(player.health < enemy.health) {
        document.getElementById("displayText").innerHTML = "Player 2 Wins";
    }
}

let timer = 300;
let timerId;
function decreaseTimer(player, enemy) {
    if(timer > 0) {
        timerId = setTimeout(decreaseTimer, 1000, player, enemy);
        timer--;
        document.getElementById("timer").innerHTML = timer;
    }
    if(timer === 0) {
        determineWinnder({player, enemy, timerId});
    }
}
