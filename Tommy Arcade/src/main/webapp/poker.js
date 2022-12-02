var playerCards = [];
var oppCards = [];
var commCards = [];
var odds = [];
var state = "waiting";
var winner = ""

var playerBet = 0;
var allIn = false;
var opponentBet = 0;
var potSize = 0;
var stackSize = 2000;

function startGame(){
        var xhttp = new XMLHttpRequest();
        xhttp.onload = function() {
            console.log(this.responseText);
            data = JSON.parse(this.responseText);
            if(getCookie("username").length > 0){//Checks for user
                stackSize = data["chipCount"];
            }
            playerCards = data["player"];
            oppCards = data["opponent"];
            commCards = data["community"];
            winner = data["winner"];
            winningHand = data["winningHand"];
            winningHand = winningHand.replace(/_/g, " ");

            if(stackSize >= 100){//Enough to play
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
                allIn = false;
                if(stackSize == 0) allIn = true;
            }
            else{//Insufficient Chips        
                document.getElementById("status").innerHTML = "Insufficient Chips to Play";
            }

        };
        username = getCookie("username");
        xhttp.open("GET", "/Tommy_Arcade/PokerServlet" + "?username=" + username + "&action=" + "INIT", true);
        xhttp.send();
}

function updateChips(){
    var xhttp = new XMLHttpRequest();
    username = getCookie("username");
    xhttp.open("GET", "/Tommy_Arcade/ChipUpdateServlet" + "?username=" + username + "&newBalance=" + stackSize);
    xhttp.send();
    console.log("Update Request SEnt");
}

function getCookie(name) {
    var dc = document.cookie;
    var prefix = name + "=";
    var begin = dc.indexOf("; " + prefix);
    if (begin == -1) {
        begin = dc.indexOf(prefix);
        if (begin != 0) return null;
    }
    else
    {
        begin += 2;
        var end = document.cookie.indexOf(";", begin);
        if (end == -1) {
        end = dc.length;
        }
    }
    return decodeURI(dc.substring(begin + prefix.length, end));
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
        if(stackSize > diff){//Can call full
            stackSize -= diff;
            playerBet += diff;
            potSize += diff;
            updateNumbers();
            document.getElementById("status").innerHTML = "Call " + diff;
            moveState();
        }
        else{//All in
            allIn = true;
            playerBet += stackSize;
            potSize -= diff;
            potSize += 2*stackSize;
            stackSize = 0;
            updateNumbers();
            document.getElementById("status").innerHTML = "All in for " + stackSize;
            moveState();
        }
        
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
            if(raise < 0) alert("Invalid Bet");
            else if(raise==0) break;
            else if(raise <= stackSize){//Valid Bet
                if(raise == stackSize) allIn=true;
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
        while(true){
            raise = parseInt(prompt("How much would you like to rebet?"));
            if(raise < stackSize && raise >= diff){//Valid Bet
                stackSize -= (raise + diff);
                playerBet += (raise + diff);
                potSize += (raise + diff);
                updateNumbers();
                opponentAction(raise);
            }
            else if(raise > stackSize){
                alert("Insufficient Chips");
            }
            else if (raise < diff){
                alert("Reraise is too small (must be at least previous bet)")
            }
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
        if(action < 20){//Opponent Folds
            stackSize += potSize;
            winner = "player";
            state = "postgame";
            document.getElementById("status").innerHTML = "Player Wins By Opponent Folding";
            document.getElementById("leftButton").textContent = "-----";
            document.getElementById("midButton").textContent = "PLAY AGAIN";
            document.getElementById("rightButton").textContent = "RUNOUT";
        }
        else{//Opponent Calls
            opponentBet += raiseValue;
            potSize += raiseValue;
            document.getElementById("status").innerHTML = "Opponent Calls " + raiseValue;
            updateNumbers();
            moveState();
        }
    }
    
}

function moveState(){
    if(state == "waiting"){
        state = "preflop";
        startGame();
    }
    else if(allIn){
        state = "postgame";
        flop();
        turn();
        river();
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
        updateChips();
        allIn=false;
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
        updateChips();
        allIn=false;
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

window.onload = function welcomeMessage(){
	alert("Welcome to Tommy's Poker Room! Enjoy your stay!");
	if(getCookie("username").length > 0){//Checks for user
		return;
	}
	alert("NOTICE: You are playing on a guest account. Any chips earned/lost will not be saved.");
}

function logOut(){
    document.cookie = "username=";
    document.location.href = "http://localhost:8080/Tommy_Arcade/homewithchat.html";
}