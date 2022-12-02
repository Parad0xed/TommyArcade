 $(function(){
	$("#loginform").submit(function(e) {
	    e.preventDefault();
	    //document.chatform.chatinput.value = ""
		let uname = document.getElementById("username").value
		$.post({
			url: "LoginServlet",
			dataType: "text",	
			data: {
				username: document.getElementById("username").value,
				password: document.getElementById("password").value
			},
			success: function( result ) {
				if(result == -1){
					alert("Invalid username or password")
					document.getElementById("username").value = ""
					document.getElementById("password").value = ""
				}
				else{
					// set cookies
					document.cookie = "username="+ uname;
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