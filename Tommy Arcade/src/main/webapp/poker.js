function flop(){
    console.log("Flopping the Cards")
    document.getElementById("flop1").src = "images/cards/AS.png";
    document.getElementById("flop2").src = "images/cards/AC.png";
    document.getElementById("flop3").src = "images/cards/AH.png";
}

function turn(){
    document.getElementById("turn").src = "images/cards/10D.png";
}

function river(){
    document.getElementById("river").src = "images/cards/KC.png"
}

function playerShow(){
    document.getElementById("playerCard1").src = "images/cards/8C"
    document.getElementById("playerCard2").src = "images/cards/8S"
}

function opponentShow(){

}