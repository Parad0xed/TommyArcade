var playerCards = [];
var opponentCards = [];
var communityCards = [];
var odds = [];
var playerBet = 0;
var opponentBet = 0;
var pot = 0;

function startGame(){
    var xhttp = new XMLHttpRequest();
    xhttp.onload = function() {
        console.log(this.responseText);
        data = JSON.parse(this.responseText);
        playerCards = data["player"];
        opponentCards = data["opponent"];
        communityCards = data["community"];

        document.getElementById("playerCard1").src = "images/cards/" + playerCards[0] + ".png";
        document.getElementById("playerCard2").src = "images/cards/" + playerCards[1] + ".png";
    };
    // /username = getCookie("username");
    username = "Player1"
    xhttp.open("GET", "/Tommy_Arcade/PokerServlet" + "?username=" + username + "&action=" + "INIT", true);
    xhttp.send();
}

function resetGame(){
    playerCards = [];
    opponentCards = [];
    commuintyCards = [];
}

function flop(){
    document.getElementById("flop1").src = "images/cards/" + communityCards[0] + ".png";
    document.getElementById("flop2").src = "images/cards/" + communityCards[1] + ".png";
    document.getElementById("flop3").src = "images/cards/" + communityCards[2] + ".png";
}

function turn(){
    document.getElementById("turn").src = "images/cards/" + communityCards[3] + ".png";
}

function river(){
    document.getElementById("river").src = "images/cards/" + communityCards[4] + ".png";
}

function showdown(){
    document.getElementById("opponentCard1").src = "images/cards/" + opponentCards[0] + ".png";
    document.getElementById("opponentCard2").src = "images/cards/" + opponentCards[1] + ".png";
}