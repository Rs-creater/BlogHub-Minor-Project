<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.sql.*" %>
<%@ page import="jakarta.servlet.http.*" %>

<%
// Get form parameters
String username = request.getParameter("name");
String password = request.getParameter("password");
boolean rememberMe = request.getParameter("remember") != null;

Connection conn = null;
PreparedStatement pstmt = null;
ResultSet rs = null;

try {
    // Load the JDBC driver
    Class.forName("com.mysql.jdbc.Driver");
    
    // Replace with your database connection details
    String dbURL = "jdbc:mysql://localhost:3306/bloghub";
    String dbUser = "root";
    String dbPassword = "";
    
    // Create a connection
    conn = DriverManager.getConnection(dbURL, dbUser, dbPassword);
    
    // Create a SQL query to validate user credentials
    String sql = "SELECT * FROM user_info WHERE username = ? AND password = ?";
    pstmt = conn.prepareStatement(sql);
    pstmt.setString(1, username);
    pstmt.setString(2, password);
    
    // Execute the query
    rs = pstmt.executeQuery();
    
    // Check if user exists
    if (rs.next()) {
        // User exists, create session
        session.setAttribute("username", username);
        session.setAttribute("userId", rs.getInt("user_id"));
        session.setAttribute("fullName", rs.getString("name"));
        session.setAttribute("email", rs.getString("email"));
        
        // If remember me is checked, store cookie
        if (rememberMe) {
            Cookie usernameCookie = new Cookie("username", username);
            usernameCookie.setMaxAge(60 * 60 * 24 * 30); // 30 days
            response.addCookie(usernameCookie);
        }
        
        // Redirect to home page
        response.sendRedirect("home.jsp");
    } else {
        // User does not exist or password is wrong
        // Redirect back to login page with error
        response.sendRedirect("login1.html?error=invalid");
    }
} catch (Exception e) {
    out.println("<h2>Error: " + e.getMessage() + "</h2>");
} finally {
    // Close resources
    if (rs != null) try { rs.close(); } catch (SQLException e) {}
    if (pstmt != null) try { pstmt.close(); } catch (SQLException e) {}
    if (conn != null) try { conn.close(); } catch (SQLException e) {}
}
%>