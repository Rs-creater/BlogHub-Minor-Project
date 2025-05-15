<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.sql.*" %>
<%
    // Check if user is logged in
    String username = (String) session.getAttribute("username");
    if (username == null) {
        // Redirect to login page if not logged in
        response.sendRedirect("login.jsp");
        return;
    }

    // Database connection parameters
    String jdbcURL = "jdbc:mysql://localhost:3306/bloghub";
    String dbUser = "root";
    String dbPassword = "";
    Connection conn = null;
    PreparedStatement pstmt = null;
    ResultSet rs = null;
    
    String name = "";
    String bio = "";
    String email = "";
    String message = "";
    String messageClass = "";
    
    try {
        Class.forName("com.mysql.cj.jdbc.Driver");
        conn = DriverManager.getConnection(jdbcURL, dbUser, dbPassword);
        
        // Process form submission if it's a POST request
        if (request.getMethod().equalsIgnoreCase("post")) {
            // Get form parameters
            name = request.getParameter("name");
            bio = request.getParameter("bio");
            email = request.getParameter("email");
            
            // Update user info in database
            String updateSQL = "UPDATE user_info SET name=?, bio=?, email=? WHERE username=?";
            pstmt = conn.prepareStatement(updateSQL);
            pstmt.setString(1, name);
            pstmt.setString(2, bio);
            pstmt.setString(3, email);
            pstmt.setString(4, username);
            
            int rowsUpdated = pstmt.executeUpdate();
            if (rowsUpdated > 0) {
                message = "Profile updated successfully!";
                messageClass = "success";
            } else {
                message = "Failed to update profile. Please try again.";
                messageClass = "error";
            }
            
            // Close the prepared statement
            pstmt.close();
        }
        
        // Retrieve current user data to display in the form
        String selectSQL = "SELECT name, bio, email FROM user_info WHERE username=?";
        pstmt = conn.prepareStatement(selectSQL);
        pstmt.setString(1, username);
        rs = pstmt.executeQuery();
        
        if (rs.next()) {
            name = rs.getString("name");
            bio = rs.getString("bio");
            email = rs.getString("email");
        }
        
    } catch (Exception e) {
        message = "Error: " + e.getMessage();
        messageClass = "error";
        e.printStackTrace();
    } finally {
        try {
            if (rs != null) rs.close();
            if (pstmt != null) pstmt.close();
            if (conn != null) conn.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
%>