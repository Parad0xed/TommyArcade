var playerCards = [];
var oppCards = [];
var commCards = [];
var odds = [];
var state = "waiting";
var winner = ""

var playerBet = 0;
var opponentBet = 0;
var potSize = 0;
var stackSize = 2000;


function startGame(){
    if(stackSize >= 100){//Sufficient Chips to Play
        var xhttp = new XMLHttpRequest();
        xhttp.onload = function() {
            console.log(this.responseText);
            data = JSON.parse(this.responseText);
            playerCards = data["player"];
            oppCards = data["opponent"];
            commCards = data["community"];
            winner = data["winner"];
            winningHand = data["winningHand"];
            winningHand = winningHand.replace(/_/g, " ");

            document.getElementById("playerCard1").src = "images/cards/" + playerCards[0] + ".png";
            document.getElementById("playerCard2").src = "images/cards/" + playerCards[1] + ".png";
            document.getElementById("oppCard1").src = "images/cards/backB.png";
            document.getElementById("oppCard2").src = "images/cards/backB.png";
            document.getElementById("commCard1").src = "images/cards/backB.png";
            document.getElementById("commCard2").src = "images/cards/backB.png";
            document.getElementById("commCard3").src = "images/cards/backB.png";
            document.getElementById("commCard4").src = "images/cards/backB.png";
            document.getElementById("commCard5").src = "images/cards/backB.png";
            
            document.getElementById("status").innerHTML = "Your Move";
            document.getElementById("leftButton").textContent = "FOLD";
            document.getElementById("midButton").textContent = "CHECK/CALL";
            document.getElementById("rightButton").textContent = "BET";
    
            playerBet = 100;
            opponentBet = 100;
            potSize = 200;
            stackSize -= 100;
            updateNumbers();
            state = "preflop";
            console.log("Game Started...");
        };
        // /username = getCookie("username");
        username = "Player1"
        xhttp.open("GET", "/Tommy_Arcade/PokerServlet" + "?username=" + username + "&action=" + "INIT", true);
        xhttp.send();
    }
    else{//Not Enough Chips to Play
        document.getElementById("status").innerHTML = "Insufficient Chips to Play";
    }

}

function flop(){
    document.getElementById("commCard1").src = "images/cards/" + commCards[0] + ".png";
    document.getElementById("commCard2").src = "images/cards/" + commCards[1] + ".png";
    document.getElementById("commCard3").src = "images/cards/" + commCards[2] + ".png";
}

function turn(){
    document.getElementById("commCard4").src = "images/cards/" + commCards[3] + ".png";
}

function river(){
    document.getElementById("commCard5").src = "images/cards/" + commCards[4] + ".png";
}

function showdown(){
    document.getElementById("oppCard1").src = "images/cards/" + oppCards[0] + ".png";
    document.getElementById("oppCard2").src = "images/cards/" + oppCards[1] + ".png";
}

function leftButtonFunc(){//Fold
    if(state == "postgame"){
        showdown();
        document.getElementById("leftButton").textContent = "-----";
    }
    else {
        winner = "opponent";
        state = "postgame";
        document.getElementById("status").innerHTML = "Opponent Wins By Player Folding";
        document.getElementById("leftButton").textContent = "SEE HAND";
        document.getElementById("midButton").textContent = "PLAY AGAIN";
        document.getElementById("rightButton").textContent = "RUNOUT";
    }
    
}

function midButtonFunc(){
    if(state == "waiting" || state=="postgame"){
        moveState();
    }
    else if(playerBet == opponentBet){//Initial limp
        document.getElementById("status").innerHTML = "Check";
        opponentAction(0);
    }
    else if(playerBet < opponentBet){//Call Opponent Raise
        const diff = opponentBet-playerBet;
        stackSize -= diff;
        playerBet += diff;
        potSize += diff;
        updateNumbers();
        document.getElementById("status").innerHTML = "Call " + diff;
        moveState();
    }
}

function rightButtonFunc(){
    if(state == "postgame"){
        flop();
        turn();
        river();
        document.getElementById("rightButton").textContent = "-----";
    }
    else if(playerBet == opponentBet){//First Raise
        var raise;
        while (true){
            raise = parseInt(prompt("How much would you like to bet?"));
            if(raise <= stackSize){//Valid Bet
                stackSize -= raise;
                playerBet += raise;
                potSize += raise;
                updateNumbers();
                opponentAction(raise);
                break;
            }
            else if(raise > stackSize){
                alert("Insufficient Chips");
            }
        }
    }
    else if(opponentBet > playerBet){//Re Raise
        const diff = opponentBet - playerBet;
        raise = parseInt(prompt("How much would you like to rebet?"));
            if(raise < stackSize && raise >= diff){//Valid Bet
                stackSize -= (raise + diff);
                playerBet += (raise + diff);
                potSize += (raise + diff);
                updateNumbers();

            }
            else if(raise > stackSize){
                alert("Insufficient Chips");
            }
            else if (raise < diff){
                alert("Reraise is too small (must be at least previous bet)")
            }

    }
}

function opponentAction(raiseValue){
    const action = Math.floor(Math.random() * 101);
    if(raiseValue == 0){//Player limp
        if(action <= 70){//Opponent Checks
            document.getElementById("status").innerHTML = "Opponent Checks";
            moveState();
        }
        else{//Opponent Raises
            const raiseValue = Math.floor(Math.random() * 4) + 1
            document.getElementById("status").innerHTML = "Opponent raises by " + raiseValue*100;
            potSize += (raiseValue*100);
            opponentBet += (raiseValue*100);
            updateNumbers();
            
        }
    }
    else if(raiseValue > 0){//Player raises
        if(action >= 20){//Opponent Calls
            const diff = playerBet-opponentBet;
            opponentBet += diff;
            potSize += diff;
            document.getElementById("status").innerHTML = "Opponent Calls " + diff;
            updateNumbers();
            moveState();
        }
        else{//Opponent Folds
            stackSize += potSize;
            winner = "player";
            state = "postgame";
            document.getElementById("status").innerHTML = "Player Wins By Opponent Folding";
            document.getElementById("leftButton").textContent = "-----";
            document.getElementById("midButton").textContent = "PLAY AGAIN";
            document.getElementById("rightButton").textContent = "RUNOUT";
        }
    }
    
}

function moveState(){
    if(state == "waiting"){
        state = "preflop";
        startGame();
    }
    else if(state == "preflop"){
        state = "flop";
        flop();
    }
    else if(state == "flop"){
        state = "turn";
        turn();
    }
    else if(state == "turn"){
        state = "river";
        river();
    }
    else if(state == "river"){
        state = "postgame";
        showdown();
        document.getElementById("leftButton").textContent = "-----";
        document.getElementById("midButton").textContent = "PLAY AGAIN";
        document.getElementById("rightButton").textContent = "-----";

        if(winner == "player"){
            document.getElementById("status").innerHTML = "You win " + potSize + " with " + winningHand;
            stackSize += potSize;
        }
        else if(winner == "opponent"){
            document.getElementById("status").innerHTML = "Opponent wins " + potSize + " with " + winningHand;
        }
        else if(winner == "both"){
            document.getElementById("status").innerHTML = "Split pot with " + winningHand;
            stackSize += (potSize/2);
        }
        winner = "";
        updateNumbers();
    }
    else if(state == "postgame"){
        state = "preflop"
        startGame();
    }
}

function updateNumbers(){
    document.getElementById("currentBet").innerHTML = "CURRENT BET<br>" + playerBet;
    document.getElementById("opponentBet").innerHTML = "OPPONENT BET<br>" + opponentBet;
    document.getElementById("potSize").innerHTML = "POT SIZE<br>" + potSize;
    document.getElementById("stackSize").innerHTML = "STACK SIZE<br>" + stackSize;
}