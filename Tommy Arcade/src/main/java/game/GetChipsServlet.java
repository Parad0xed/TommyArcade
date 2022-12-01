package game;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import login_signup.JDBCConnector;

@WebServlet("/GetChipsServlet")
public class GetChipsServlet extends HttpServlet{
private static final long serialVersionUID = 1L;
	
	protected void service(HttpServletRequest request, HttpServletResponse response) 
			throws ServletException, IOException {
		String username = request.getParameter("username");
		response.setContentType("text/plain");
		JDBCConnector.getChips(username);
		PrintWriter out = response.getWriter();
		out.println(JDBCConnector.getChips(username));
		out.close();
	}
}
