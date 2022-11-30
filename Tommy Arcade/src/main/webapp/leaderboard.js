/**
 * 
 */
 // DO GUEST  COOKIE STUFF TO UPDATE NAV BAR DEPENDING ON STATUS
 
 $(function(){
	$.get({
		url: "LeaderboardServlet",
		success: function( result ) {
			console.log("from leaderboard get, result is: "+result);
			buildLeaderboardDisplay(result)
		}
	});
})

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