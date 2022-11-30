/**
 * 
 */
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


function signup() {
	$(function(){
	console.log(document.getElementById("username").value)
    return 	$.post({
		url: "SignupServlet",
		type: "POST",
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
	}
}

function handleData(data) {
    alert(data);
    //do some stuff
}

signup().done(handleData);