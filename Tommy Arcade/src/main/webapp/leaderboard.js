/**
 * 
 */
 // DO GUEST  COOKIE STUFF TO UPDATE NAV BAR DEPENDING ON STATUS
 
 $(function(){
	
	let currUname = getCookie("uname");
	if(currUname == "" || currUname == null){
		currUname = "Guest"
		buildGuestHeader();
	}
	else{
		buildUserHeader(currUname);
	}
	
	$.get({
		url: "LeaderboardServlet",
		success: function( result ) {
			console.log("from leaderboard get, result is: "+result);
			buildLeaderboardDisplay(result)
		}
	});
	
	$("#logoutbutton").click(function() {
	    //document.chatform.chatinput.value = ""
		document.cookie = "uname=";
		alert("Successfully logged out.")
    	document.location.href = "http://localhost:8080/Tommy_Arcade/homewithchat.html";
	});
})

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

function buildLeaderboardDisplay(result){
	if (result === ""){
		return;
	}
	const leaders = result.split("\n");
	console.log("number of rows is leaders size is: "+leaders.length+" and leaders has: "+leaders)
	for(let i = 0; i < leaders.length-1; i++){
		let leader = leaders[i].split(" ");
		let wrapper = document.querySelector("#leader"+(i+1));
		if(wrapper != null){
			wrapper.innerHTML = `
				${i+1}. <strong>${leader[0]}</strong> : ${leader[1]} chips
			`;
		}
	}
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
