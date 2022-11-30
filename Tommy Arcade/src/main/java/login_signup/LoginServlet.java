package login_signup;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

@WebServlet("/LoginServlet")
public class LoginServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	
	protected void doPost (HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		System.out.println("Tommys arcade: reached login servlet");
		
		PrintWriter out = response.getWriter();
		HttpSession session = request.getSession();

		String uname = request.getParameter("username");
		String pwd = request.getParameter("password");
		
		int result = JDBCConnector.loginUser(uname, pwd);
		if(result == -1) { // invalid name / pass
			out.println("<script type=\"text/javascript\">");
			out.println("alert('Invalid username or password.');");
			out.println("location='login.html';");
			out.println("</script>");
		}
		else if(result == -2) {
			System.out.println("SQLE from LoginServlet call");
		}
		else { // OK
			session.setAttribute("isGuest", false);
			session.setAttribute("UID", result);
			response.sendRedirect("home.html");
		}
		
		
	}
}
