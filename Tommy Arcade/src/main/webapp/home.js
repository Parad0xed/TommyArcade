/**
 * 
 */
 // from WebSocket slides
 // background-color: rgba(100, 50, 100, 0.8);
 var socket
 $(function(){
	let currUname = getCookie("uname");
	if(currUname == "" || currUname == null){
		currUname = "Guest"
		buildGuestHeader();
	}
	else{
		let capUname = currUname.toUpperCase();
		$.ajax({
			url: "GetChipsServlet",
			dataType: "text",	
			data: {
				username: currUname,
			},
			success: function( result ) {
				buildUserHeader(capUname, result)
				$("#logoutbutton").click(function() {
				    //document.chatform.chatinput.value = ""
					document.cookie = "uname=";
					alert("Successfully logged out.")
			    	document.location.href = "http://localhost:8080/Tommy_Arcade/homewithchat.html";
				});
				
				$("#claimdaily").click(function() {
					alert("clicked claim")
					$.get({
						url: "ClaimDailyServlet",
						dataType: "text",
						data: {
							username: currUname
						},
						success: function( result ){
							alert("claim daily result is: "+result);
							if(result == 0){
								alert("Claimed daily chips! 100 Chips were added to your account.")
							}
							else if(result == 1) {
								alert("Daily chips already claimed :(")
							}
					    	document.location.href = "http://localhost:8080/Tommy_Arcade/homewithchat.html";
					    	
						}
					});
				});
			}
		});	
		// numChips = 1234;
		// buildUserHeader(currUname, numChips);
	}
	
	
	
	socket = new WebSocket("ws://localhost:8080/Tommy_Arcade/chat");
	socket.onopen = function(event){
		document.getElementById("chat-messages").innerHTML += "<span class='system-text'>Connected to chat... </span><br/>"
	}
	socket.onmessage = function(event){
		document.getElementById("chat-messages").innerHTML += event.data + "<br />";
	    $("#chat-messages").scrollTop($("#chat-messages")[0].scrollHeight);
	    if(!($("#chat-messages").is(":visible"))) {
			$('#chat-messages').show();
		}
	}
	socket.onclose = function(event){
		document.getElementById("chat-messages").innerHTML += "Disconnected!";
	}
	
	$("#chatform").submit(function(e) {
	    e.preventDefault();
	    if(document.chatform.chatinput.value == "")
	    	return false;
	    socket.send("<i>("+currUname+")</i>: "+document.chatform.chatinput.value)
	    document.chatform.chatinput.value = ""
		return false;
	});
	
	$(document).on('keypress', function(e) {
        if(e.which == 13) { // enter
        	// alert("current active focus is..."+(document.activeElement == document.getElementById("chat-input")))
        	if(document.activeElement == document.getElementById("chatinput") &&
        		 document.chatform.chatinput.value == ""){ // currently focused on chat input and empty
				document.activeElement.blur()
				$('#chat-messages').fadeOut();
			}
			else{
        		$('#chatinput').focus();   
        		$('#chat-messages').fadeIn();    
    		}                    
        }
    });
    
    console.log("username cookie: "+getCookie("uname"));
    
    
});

function buildGuestHeader(){
	let str = `
		<img src = "images/coin.png" width = "35" height = "35">
		<div class = "token-display">
			<span>---&nbsp;</span>
		</div>
		<div class = "user-logout">
			<span style = "display: inline-block;"></span>
		</div>
		<div class = "user-logout header-button" id="loginbutton"  onclick="location.href = 'login.html';" style="display: inline-block;">
			Login
		</div>
	`;
	document.getElementById("header").innerHTML = str;
	// <button class = "login" id="homebutton" onclick="location.href = 'homewithchat.html';">Home</button>
	// <button class = "login" id="loginbutton" onclick="location.href = 'login.html';">Log In</button>
}

function buildUserHeader(uname, numChips){
	let str = `
		<img src = "images/coin.png" width = "35" height = "35">
		<div class = "token-display">
			<span>${numChips}&nbsp;</span>
		</div>
		<div class = "user-logout header-button" id="logoutbutton" style="display: inline-block;">
			Logout
		</div>
		<div class = "user-logout header-button" id="claimdaily" style="display: inline-block;">
			Claim Daily!
		</div>
		<div class="user-logout" style="display: inline-block;">
			<span class="uname-display" >${uname}&nbsp;</span>
		</div>
		
	`;
	// <button class = "logout" id="logoutbutton" type = "submit">Log Out</button>
	document.getElementById("header").innerHTML = str;
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
