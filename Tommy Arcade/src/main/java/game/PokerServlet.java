package game;

import java.io.*;
import java.lang.*;
import java.net.*;
import java.sql.Date;
import java.text.DateFormat;
import java.text.DecimalFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Vector;
import java.util.Formatter.BigDecimalLayoutForm;

import javax.*;
import javax.servlet.*;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

@WebServlet("/PokerServlet")
public class PokerServlet extends HttpServlet{
	
	private static final long serialVersionUID = 1L;
	
	protected void service(HttpServletRequest request, HttpServletResponse response) 
			throws ServletException, IOException {
		String action = request.getParameter("action");
		String username = request.getParameter("username");
		
		if(action.equals("INIT")) {
			
			//Get draws for given game
			Vector<String> draws = new Vector<String>();
			CardDeck deck = new CardDeck();
			for(int i=0; i<9; i++) {
				draws.add(deck.getNextCard());
			}
			
			//Call Poker API
			String temp = "https://api.pokerapi.dev/v1/winner/texas_holdem?cc=";
			for(int i=4; i<9; i++) {
				temp += draws.get(i);
				if(i < 8) temp += ",";
			}
			temp += ("&pc[]=" + draws.get(0) + "," + draws.get(1));
			temp += ("&pc[]=" + draws.get(2) + "," + draws.get(3));
			
			
			URL url = new URL(temp);
			HttpURLConnection con = (HttpURLConnection) url.openConnection();
			con.setRequestMethod("GET");
			JSONObject data = null;
			
			BufferedReader in = new BufferedReader(new InputStreamReader(con.getInputStream()));
			String inputLine;
			StringBuffer content = new StringBuffer();
			while((inputLine = in.readLine()) != null) {
				content.append(inputLine);
			}
			in.close();
			try {
				data = (JSONObject)(new JSONParser().parse(content.toString()));
			} catch (ParseException e) {
				e.printStackTrace();
			}
			
			JSONArray buffer = (JSONArray) data.get("winners");
			JSONObject winData = (JSONObject) buffer.get(0);
			String winningHand = winData.get("result").toString();
			String winner = winData.get("cards").toString().substring(0, 2);
			if(winner.equals(draws.get(0))) {//Player Wins
				winner = "player";
			}
			else {//Opponent Wins
				winner = "opponent";
			}
			if(buffer.size() > 1) winner = "tie";
			
			//Write Response JSON
			PrintWriter out = response.getWriter();
			response.setContentType("application/json");
			out.println("{");
			out.println("\"player\":[\"" + draws.get(0) + "\", \"" + draws.get(1) + "\"],");
			out.println("\"opponent\":[\"" + draws.get(2) + "\", \"" + draws.get(3) + "\"],");
			out.println("\"community\":[\"" + draws.get(4) + "\", \"" + draws.get(5) + "\", \"" 
			+ draws.get(6) + "\", \"" + draws.get(7) + "\", \"" + draws.get(8) + "\"],");
			out.println("\"winningHand\": \"" + winningHand + "\",");
			out.println("\"winner\": \"" + winner + "\"");
			out.println("}");
		}
		
		
	}
}
