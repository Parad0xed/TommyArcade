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

import login_signup.*;

@WebServlet("/BlackJackServlet")
public class BlackJackServlet extends HttpServlet{
	
	private static final long serialVersionUID = 2L;
	
	protected void service(HttpServletRequest request, HttpServletResponse response) 
			throws ServletException, IOException {
		String action = request.getParameter("action");
		String username = request.getParameter("username");
		int chipCount = 2000;
		if(username != null) {
			// if(!username.isEmpty()) chipCount = JDBCConnector.getChips(username);
		}
		
		if(action.equals("INIT")) {
			
			//Get a new shuffled deck
			Vector<String> draws = new Vector<String>();
			CardDeck deck = new CardDeck();
			Vector<String> deckArr = deck.getDeck();
			
			//Write Response JSON
			PrintWriter out = response.getWriter();
			response.setContentType("application/json");
			String rtn = "";
			rtn += "[";
			for (int i = 0; i < deckArr.size()-1; i++) {
				rtn += "\"" +  deckArr.get(i) + "\",";
			}
			rtn += "\"" +  deckArr.get(deckArr.size()-1) + "\"";
			rtn += "]";
			out.println("{\"deck\":"+rtn+",\"chipCount\":" + chipCount + "}");
		}
	}
}