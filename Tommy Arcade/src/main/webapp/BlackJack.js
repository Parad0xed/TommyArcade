var playerCards = [];
var dealerCards = [];
var playerValue = 0;
var playerAce = 0;
var dealerValue = 0;
var dealerAce = 0;
var deck = [];
var deckTop = 0;
var state = "waiting";

var playerBet = 0;
var opponentBet = 0;
var potSize = 0;
var stackSize = 2000;
var chipCount = 2000;
var username = null;


function startGame(){
    if(stackSize >= 100){//Sufficient Chips to Play
        var xhttp = new XMLHttpRequest();
        xhttp.onload = function() {
			// Clear player and dealer hands
			playerCards = [];
			dealerCards = [];
			playerValue = 0;
			playerAce = 0;
			dealerValue = 0;
			dealerAce = 0;
			
			// Reset the top of the deck
			deckTop = 0;
			// Load the new deck of cards from the backend
			jsonData = JSON.parse(this.responseText);
            deck = jsonData.deck;
            chipCount =  jsonData.chipCount;
            document.getElementById("balance").innerHTML = chipCount;
            
            // Deal two cards to the player and the dealer
            dealPlayer();
            
            dealerCards.push(deck[deckTop]);
            updateDealerValue(deck[deckTop]);
    		document.getElementById("dealer1").src = "images/cards/" + deck[deckTop]  + ".png";
    		deckTop++;
    		
            dealPlayer();
            
            dealerCards.push(deck[deckTop]);
            updateDealerValue(deck[deckTop]);
    		document.getElementById("dealer2").src = "images/cards/backR.png";
    		deckTop++;
    		
    		// Check player BlackJack
    		if (playerValue == 21){
				if (dealerValue == 21){
					//Tie
					document.getElementById("status").innerHTML = "TIED: BLACK JACK TIE";
				}
				else {
					document.getElementById("status").innerHTML = "YOU WIN: BLACK JACK";
					chipCount += 100;
				}
				
				// Update Player TOKEN
				restartGame();
				return;
			}
    		// Dealer's visible card is a 10 or Ace
    		if(dealerCards[0] == '1' || dealerCards[0] == 'J'|| dealerCards[0] == 'Q'|| dealerCards[0] == 'K'|| dealerCards[0] == 'A') {
				if (dealerValue == 21){
					// Dealer Win
					document.getElementById("status").innerHTML = "YOU LOSE: Dealer Got a BLACK JACK";
					chipCount -= 100;
					// Update Player TOKEN
					restartGame();
				}
				else {
					// Not a BlackJack
					document.getElementById("status").innerHTML = "Dealer Checked no BLACK JACK";
					// Game continues
				}
				return;
			}
			document.getElementById("status").textContent = "-----";
        };
        username = getCookie("username");
        xhttp.open("GET", "/Tommy_Arcade/BlackJackServlet" + "?username=" + username + "&action=" + "INIT", true);
        xhttp.send();
    }
    else{//Not Enough Chips to Play
        document.getElementById("status").innerHTML = "Insufficient Chips to Play";
    }
	
}

function dealPlayer(){
	playerCards.push(deck[deckTop]);
	var value = deck[deckTop].charAt(0);
	if (value == '1' || value == 'J' || value == 'Q' || value == 'K') {
		playerValue += 10;
	}
	else if (value == 'A') {
		playerValue += 11;
		playerAce += 1;
	}
	else {
		playerValue += parseInt(value);
	}
	
    document.getElementById("playerHand").innerHTML += `<img class="u-image u-image-default u-preserve-proportions u-image-1`+ (playerCards.length - 1) +`" src="images/cards/` + deck[deckTop] +`.png" alt="" data-image-width="64" data-image-height="89">`;
    deckTop++;
}

function updateDealerValue(card) {
	var value = card.charAt(0);
	if (value == '1' || value == 'J' || value == 'Q' || value == 'K') {
		dealerValue += 10;
	}
	else if (value == 'A') {
		dealerValue += 11;
		dealerAce += 1;
	}
	else {
		dealerValue += parseInt(value);
	}
}

function leftButtonFunc(){//Fold
    if(state == "started"){
		// Reveal dealer's second card
		document.getElementById("dealer2").src = "images/cards/" + dealerCards[1]  + ".png";
        // Find Dealer value
		while (dealerValue <17) {
			// If nominally BUST, but hand contains ACE, treat the ACE as 1
			while (dealerValue > 21 && dealerAce > 0) {
				dealerValue -= 10;
				dealerAce -= 1;
			}
			dealerCards.push(deck[deckTop]);
            updateDealerValue(deck[deckTop]);
    		document.getElementById("dealer" + String(dealerCards.length) ).src = "images/cards/" + deck[deckTop]  + ".png";
    		deckTop++;
		}
		// Find player value
		while (playerValue > 21){
			playerValue -= 10;
		}
		
		if(dealerValue > 21)
		{
			document.getElementById("status").innerHTML = "YOU WIN: Dealer BUST";
			chipCount += 100;
		}
		else if(dealerValue == playerValue)
		{
			document.getElementById("status").innerHTML = "TIE";
		}
		else if(dealerValue > playerValue)
		{
			document.getElementById("status").innerHTML = "YOU LOSE: " + String(playerValue) + " vs " + String(dealerValue);
			chipCount -= 100;
		}
		else {
			document.getElementById("status").innerHTML = "YOU WIN: " + String(playerValue) + " vs " + String(dealerValue);
			chipCount += 100;
		}
		restartGame();
    }
    
}

function midButtonFunc(){
	// Mid is "START"
    if(state == "waiting"){
		state = "started";
        document.getElementById("leftButton").textContent = "STAND";
        document.getElementById("midButton").textContent = "HIT";
		startGame();
    }
    // Mid is "REPLAY"
    else if (state == "postgame"){
		// Clear Screen
		for (let i = 1; i < 8; i++){
			document.getElementById("dealer" + String(i)).src = "images/cards/backR.png";
		}
		document.getElementById("playerHand").innerHTML = "";
		
		state = "waiting";
		document.getElementById("midButton").textContent = "PLAY";
		document.getElementById("status").textContent = "Press Play to Start Game";
	}
    // Mid is "HIT"
    else if (state == "started") {
		dealPlayer();
		// Check player bust
		if ((playerValue - 10*playerAce) > 21) {
			document.getElementById("status").innerHTML = "YOU LOSE: BUST";
			chipCount -= 100;
			restartGame();
		}
		else{
			document.getElementById("status").textContent = "-----";
		}
	}
}

function restartGame(){
	// Update the balance on display
	document.getElementById("balance").innerHTML = chipCount;
	// Send the new chipCount/balance to the database
	var xhttp = new XMLHttpRequest();
    username = getCookie("username");
    xhttp.open("GET", "/Tommy_Arcade/ChipUpdateServlet" + "?username=" + username + "&newBalance=" + chipCount);
    xhttp.send();
    console.log("Update Request SEnt");
    
	state = "postgame";
	document.getElementById("leftButton").textContent = "-----";
	document.getElementById("midButton").textContent = "REPLAY";
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

window.onload = function welcomeMessage(){
	alert("Welcome to Tommy's Blackjack Table! Enjoy your stay!");
	if(getCookie("username").length > 0){//Checks for user
		return;
	}
	alert("NOTICE: You are playing on a guest account. Any chips earned/lost will not be saved.");
}

function logOut(){
    document.cookie = "username=";
    document.location.href = "http://localhost:8080/Tommy_Arcade/homewithchat.html";
}