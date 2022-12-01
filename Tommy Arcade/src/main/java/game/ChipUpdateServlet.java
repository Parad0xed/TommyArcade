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

@WebServlet("/ChipUpdateServlet")
public class ChipUpdateServlet extends HttpServlet{
	
	private static final long serialVersionUID = 1L;
	
	protected void service(HttpServletRequest request, HttpServletResponse response) 
			throws ServletException, IOException {
		
		String username = request.getParameter("username");
		int newBalance = -1;
		try {
			newBalance = Integer.parseInt(request.getParameter("newBalance"));
			if(newBalance == -1) return;
		} catch(Exception e){
			return;
		}
		response.setContentType("text/plain");
		JDBCConnector.setChipCount(username, newBalance);
		PrintWriter out = response.getWriter();
		out.println("Done");
		out.close();
	}
	
	
}
