package login_signup;

import java.sql.Connection;
import java.sql.Date;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
//import com.google.gson.Gson;

public class JDBCConnector {
	public static int claimDaily(String username) {
		// 0 is ALREADY CLAIMED, 1 is SUCCESSFULLY CLAIMED, -1 is SQL ERROR
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
			
			
			// get current time
			java.util.Date dt = new java.util.Date();
			java.text.SimpleDateFormat sdf = 
			     new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			String currentTime = sdf.format(dt);
			
			// get previous claim time
			rs = st.executeQuery("select claimTime from Users where uname = '"+username+"'");
			rs.next();
			java.util.Date prevTime = rs.getTimestamp("claimTime");
			
			if(prevTime == null) {
				// set claim to current time, add chips
				st.executeUpdate("update Users set claimTime = '"+currentTime+"' where uname = '"+username+"'");
				addToChips(username, 100);
				return 1;
			}
			
			long MILLIS_PER_DAY = 24 * 60 * 60 * 1000L;
		    boolean moreThanDay = Math.abs(prevTime.getTime() - dt.getTime()) > MILLIS_PER_DAY;
		    if(moreThanDay) {
		    	// set claim to current time, add chips
		    	st.executeUpdate("update Users set claimTime = '"+currentTime+"' where uname = '"+username+"'");
				addToChips(username, 100);
		    	return 1;
		    }
			
			
			return 0;			
		} catch(SQLException sqle) {
			System.out.println("SQLE in claimDaily: "+sqle.getMessage());
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
		return -1;
	}
	public static void setChipCount(String username, int num) {
		try {
			Class.forName("com.mysql.cj.jdbc.Driver");
		} catch (ClassNotFoundException e) {
			System.out.println("Error JDBCConn: "+e.getMessage());
		}
		
		Connection conn = null;
		Statement st = null;
		
		try {
			conn = DriverManager.getConnection("jdbc:mysql://localhost/TommysArcade?user=root&password=root&useSSL=false");
			st = conn.createStatement();
			
			// I assume the number of chips you want to remove (if num is negative) is a valid number
			// Call getChips to check if we should not assume validity
			st.executeUpdate("update Users set chips ="+ num +" where uname = '"+username+"'");
			
		} catch(SQLException sqle) {
			System.out.println("SQLE in getLeaderboard: "+sqle.getMessage());
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
		
	}
	
	
	public static void addToChips(String username, int num) {
		try {
			Class.forName("com.mysql.cj.jdbc.Driver");
		} catch (ClassNotFoundException e) {
			System.out.println("Error JDBCConn: "+e.getMessage());
		}
		
		Connection conn = null;
		Statement st = null;
		//ResultSet rs = null;
		
		try {
			conn = DriverManager.getConnection("jdbc:mysql://localhost/TommysArcade?user=root&password=root&useSSL=false");
			st = conn.createStatement();
			
			// I assume the number of chips you want to remove (if num is negative) is a valid number
			// Call getChips to check if we should not assume validity
			st.executeUpdate("update Users set chips = chips + "+num+" where uname = '"+username+"'");
			
		} catch(SQLException sqle) {
			System.out.println("SQLE in getLeaderboard: "+sqle.getMessage());
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
	}
	public static int getChips(String username) {
		// return -1 = SQL error, else returns number of chips
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
			rs = st.executeQuery("select chips from Users where uname = '"+username+"'");
			rs.next();
			int numChips = rs.getInt("chips");
			
			return numChips;
		} catch(SQLException sqle) {
			System.out.println("SQLE in getBal: "+sqle.getMessage());
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
		return -1;
	}
	public static String getLeaderboard() {
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
			rs = st.executeQuery("select uname, chips from Users order by chips DESC");
			int count = 0;
			ArrayList<String> unames = new ArrayList<String>();
			ArrayList<Integer> bals = new ArrayList<Integer>();
			while(rs.next() && count <= 3) {
				bals.add(rs.getInt("chips"));
				unames.add(rs.getString("uname"));
				count++;
			}
			
			String str = "";
			for(int i = 0; i < unames.size(); i++) {
				str += unames.get(i) + " " + bals.get(i) + "\n";
			}
			return str;
		} catch(SQLException sqle) {
			System.out.println("SQLE in getLeaderboard: "+sqle.getMessage());
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
		return "";
	}
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
