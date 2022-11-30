package login_signup;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
//import java.util.ArrayList;
//import com.google.gson.Gson;

public class JDBCConnector {
	public static int registerUser(String uname, String pwd) {
		// -1 = user exists, -2 = SQL error, else = user id 
		try {
			Class.forName("com.mysql.cj.jdbc.Driver");
		} catch (ClassNotFoundException e) {
			System.out.println("Error JDBCConn: "+e.getMessage());
		}
		
		Connection conn = null;
		Statement st = null;
		ResultSet rs = null;
		
		try {
			conn = DriverManager.getConnection("jdbc:mysql://localhost/TommysArcade?user=root&password=root&useSSL=false");
			st = conn.createStatement();
			rs = st.executeQuery("SELECT COUNT(*) FROM Users WHERE uname = '"+uname+"'");
			int ucount = 0;
			while(rs.next()) {
				ucount = rs.getInt("COUNT(*)");
				System.out.println("ucount in JDBCConn registerUser for "+uname+" is: "+ucount);
			}
			if(ucount != 0)
				return -1;
			st.execute("INSERT INTO Users (uname, pwd) VALUES ('"+uname+"', '"+pwd+"')");
			
			rs = st.executeQuery("SELECT id FROM Users WHERE uname = '"+uname+"'");
			rs.next();
			int ID = rs.getInt("id");
			return ID;
		} catch(SQLException sqle) {
			System.out.println("SQLE in registerUser: "+sqle.getMessage());
		} finally {
			try {
				if (st != null) {
					st.close();
				}
				if (conn != null) {
					conn.close();
				}
			} catch (SQLException sqle) {
				System.out.println("sqle: "+sqle.getMessage());
			}
		}
		return -2;		
	}
	
	public static int loginUser(String uname, String pwd) {
		// -2 = SQL error, -1 = invalid user/pass, else = user ID
		try {
			Class.forName("com.mysql.cj.jdbc.Driver");
		} catch (ClassNotFoundException e) {
			System.out.println("Error JDBCConn: "+e.getMessage());
		}
		
		Connection conn = null;
		Statement st = null;
		ResultSet rs = null;
		
		try {
			conn = DriverManager.getConnection("jdbc:mysql://localhost/TommysArcade?user=root&password=root&useSSL=false");
			st = conn.createStatement();
			rs = st.executeQuery("SELECT COUNT(*) FROM Users WHERE uname = '"+uname+"'");
			int ucount = 0;
			while(rs.next()) {
				ucount = rs.getInt("COUNT(*)");
				System.out.println("ucount in JDBCConn loginuser for "+uname+" is: "+ucount);
			}
			if(ucount == 0)
				return -1;
			rs = st.executeQuery("SELECT pwd, id FROM Users WHERE uname = '"+uname+"'");
			String checkpwd = null;
//			while(rs.next()) {
//				checkpwd = rs.getString("pwd");
//				System.out.println("pwd in JDBCConn loginuser for "+uname+" is: "+checkpwd);
//			}
			rs.next(); 
			checkpwd = rs.getString("pwd");
			int ID = rs.getInt("id");
			if(!pwd.equals(checkpwd))
				return -1;
			
			System.out.println(" in jdbc loginuser, the user's id is: "+ID);
			return ID;
		} catch(SQLException sqle) {
			System.out.println("SQLE in loginUser: "+sqle.getMessage());
		} finally {
			try {
				if (st != null) {
					st.close();
				}
				if (conn != null) {
					conn.close();
				}
			} catch (SQLException sqle) {
				System.out.println("sqle: "+sqle.getMessage());
			}
		}
		
		return -2;
	}
}
