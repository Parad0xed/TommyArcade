package login_signup;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


@WebServlet("/ClaimDailyServlet")
public class ClaimDailyServlet extends HttpServlet{
private static final long serialVersionUID = 1L;
	
	protected void service(HttpServletRequest request, HttpServletResponse response) 
			throws ServletException, IOException {
		System.out.println("reached claimdailyservlet");
		String username = request.getParameter("username");
		response.setContentType("text/plain");
		int result = JDBCConnector.claimDaily(username);
		System.out.println("claim daily result: "+result);
		PrintWriter out = response.getWriter();
		out.print(result);
		out.close();
	}
}
