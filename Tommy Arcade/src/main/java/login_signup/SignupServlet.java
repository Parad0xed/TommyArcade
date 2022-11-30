package login_signup;
import java.io.IOException;
import java.io.PrintWriter;


import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

//import com.google.gson.Gson;
//import com.google.gson.GsonBuilder;


@WebServlet("/SignupServlet")
public class SignupServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
     
	protected void doPost (HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {	
		System.out.println("Tommys Arcade: Reached signup servlet");
		PrintWriter out = response.getWriter();
		HttpSession session = request.getSession();
		
		String uname = request.getParameter("username");
		String pwd = request.getParameter("password");
		
		int result = JDBCConnector.registerUser(uname, pwd);
		System.out.println("signup servlet got result = "+result);
		if(result == -1) { // user name already exists
			out.println("<script type=\"text/javascript\">");
			out.println("alert('Username already exists');");
			out.println("location='signup.html';");
			out.println("</script>");
		}
		else { // OK
			session.setAttribute("isGuest", false);
			session.setAttribute("UID", result);
			// change to use cookies.
			response.sendRedirect("home.html");
		}
		
	}
}