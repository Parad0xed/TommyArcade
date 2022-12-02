/**
 * 
 */
 
 
 $(function(){
	$("#signupform").submit(function(e) {
	    e.preventDefault();
	    //document.chatform.chatinput.value = ""
		let uname = document.getElementById("username").value
		$.post({
			url: "SignupServlet",
			dataType: "text",	
			data: {
				username: document.getElementById("username").value,
				password: document.getElementById("password").value
			},
			success: function( result ) {
				if(result == -1){
					alert("Username already exists")
					document.getElementById("username").value = ""
					document.getElementById("password").value = ""
				}
				else{
					// set cookies
					document.cookie = "uname="+ uname;
					// alert("set cookie "+getCookie("uname"))
					document.location.href = "http://localhost:8080/Tommy_Arcade/homewithchat.html";			
				}
			}
		});	
	});
});

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
/*function signup(){
	$.post({
		url: "SignupServlet",
		datatype: text,	
		data: {
			username: document.getElementById("username").value,
			password: document.getElementById("password").value
		},
		success: function( result ) {
			alert(result)
			if(result == -1){
				alert("Username already exists")
			}
			
		}
	});	
}*/


/*function signup() {
	$(function(){
	console.log(document.getElementById("username").value)
	let uname = document.getElementById("username").value;
    return 	$.post({
		url: "SignupServlet",
		type: "POST",
		data: {
			username: uname,
			password: document.getElementById("password").value
		},
		dataType: "text"
		,success: function( result ) {
			alert(result)
			if(result == -1){
				alert("Username already exists")
			}
			else{
				// set cookies
				document.cookie = "uname="+ uname;
				alert("set cookie "+getCookie("uname"))
				document.location.href = "http://localhost:8080/Tommy_Arcade/homewithchat.html";
				
			}
			
		}
	});	
	});
}*/

/*function handleData(result) {
    alert(result);
    if(result == -1){
		alert("Username already exists")
	}
	else{
		// set cookies
		document.cookie = "uname="+ uname;
		alert("set cookie "+getCookie("uname"))
		document.location.href = "http://localhost:8080/Tommy_Arcade/homewithchat.html";
		
	}
}

signup().done(handleData);*/
