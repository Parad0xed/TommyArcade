/**
 * 
 */
 // from WebSocket slides
 var socket
 $(function(){
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
	    socket.send("<i>(Uname)</i>: "+document.chatform.chatinput.value)
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
    
    console.log("scroll height is "+$("#chat-messages")[0].scrollHeight);
});

