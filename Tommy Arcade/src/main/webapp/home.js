/**
 * 
 */
 // from WebSocket slides
 var socket
 $(function(){
	let currUname = getCookie("uname");
	if(currUname == "" || currUname == null){
		currUname = "Guest"
		buildGuestHeader();
	}
	else{
		buildUserHeader(currUname);
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
    
    $("#logoutbutton").click(function() {
	    //document.chatform.chatinput.value = ""
		document.cookie = "uname=";
		alert("Successfully logged out.")
    	document.location.href = "http://localhost:8080/Tommy_Arcade/homewithchat.html";
	});
});

function buildGuestHeader(){
	let str = `
		<div class = "token-display">
			<span></span>
		</div>
		<div class = "user-logout">
			<span style = "display: inline-block;"></span>
			<button class = "login" id="homebutton" onclick="location.href = 'homewithchat.html';">Home</button>
			<button class = "login" id="loginbutton" onclick="location.href = 'login.html';">Log In</button>
		</div>
	`;
	document.getElementById("header").innerHTML = str;
}

function buildUserHeader(uname){
	let str = `
		<div class = "token-display">
			<span># of tokens</span>
		</div>
		<div class = "user-logout">
			<span style = "display: inline-block;">${uname}</span>
			<button class = "logout" id="logoutbutton" type = "submit">Log Out</button>
		</div>
	`;
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
