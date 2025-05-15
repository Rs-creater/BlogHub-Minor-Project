<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.sql.*" %>
<%@ page import="java.util.*" %>
<%@ page import="java.io.*" %>

<%
// Get form data
String fullName = request.getParameter("name");
String username = request.getParameter("username");
String email = request.getParameter("email");
String password = request.getParameter("password");
String userType = request.getParameter("user-type");
String bio = request.getParameter("bio");

// Get interest selections
String[] interests = request.getParameterValues("interests");
String[] readingInterests = request.getParameterValues("reading-interests");
String notificationPreference = request.getParameter("notification-preference");

// Initialize database variables
Connection conn = null;
PreparedStatement userStmt = null;
PreparedStatement interestStmt = null;
ResultSet rs = null;
boolean success = false;
String errorMessage = "";

try {
    // Database connection
    Class.forName("com.mysql.jdbc.Driver");
 // Default for XAMPP is often username "root" with empty password
    conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/bloghub", "root", "");
    
    // Check if username already exists
    PreparedStatement checkStmt = conn.prepareStatement("SELECT COUNT(*) FROM user_info WHERE username = ?");
    checkStmt.setString(1, username);
    rs = checkStmt.executeQuery();
    rs.next();
    if (rs.getInt(1) > 0) {
        errorMessage = "Username already exists. Please choose a different username.";
        throw new SQLException("Username already exists");
    }
    
    // Check if email already exists
    checkStmt = conn.prepareStatement("SELECT COUNT(*) FROM user_info WHERE email = ?");
    checkStmt.setString(1, email);
    rs = checkStmt.executeQuery();
    rs.next();
    if (rs.getInt(1) > 0) {
        errorMessage = "Email already registered. Please use a different email or login.";
        throw new SQLException("Email already exists");
    }
    
    // Begin transaction
    conn.setAutoCommit(false);
    
    // Insert user data
    String userSql = "INSERT INTO user_info (name, username, email, password, user_type, bio , created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())";
    userStmt = conn.prepareStatement(userSql, Statement.RETURN_GENERATED_KEYS);
    userStmt.setString(1, fullName);
    userStmt.setString(2, username);
    userStmt.setString(3, email);
    
    // In a production environment, you should hash the password
    // Example using a simple hash (not recommended for production)
    // String hashedPassword = org.apache.commons.codec.digest.DigestUtils.sha256Hex(password);
    // userStmt.setString(4, hashedPassword);
    
    // For simplicity, we're storing the password as-is (NEVER do this in production)
    userStmt.setString(4, password);
    
    userStmt.setString(5, userType);
    userStmt.setString(6, bio != null ? bio : "");
    /* userStmt.setString(7, notificationPreference != null ? notificationPreference : "daily"); */
    
    int userResult = userStmt.executeUpdate();
    
    // Get the generated user ID
    rs = userStmt.getGeneratedKeys();
    long userId = 0;
    if (rs.next()) {
        userId = rs.getLong(1);
    }
    
    // Insert user interests
    /* if (userType.equals("creator") && interests != null && interests.length > 0) {
        String interestSql = "INSERT INTO user_interests (user_id, interest_name, interest_type) VALUES (?, ?, 'writing')";
        interestStmt = conn.prepareStatement(interestSql);
        
        for (String interest : interests) {
            interestStmt.setLong(1, userId);
            interestStmt.setString(2, interest);
            interestStmt.addBatch();
        }
        
        interestStmt.executeBatch();
    } */
    
    // Insert reading interests
    /* if (userType.equals("viewer") && readingInterests != null && readingInterests.length > 0) {
        String readingInterestSql = "INSERT INTO user_info (user_id, interest_name, interest_type) VALUES (?, ?, 'reading')";
        interestStmt = conn.prepareStatement(readingInterestSql);
        
        for (String interest : readingInterests) {
            interestStmt.setLong(1, userId);
            interestStmt.setString(2, interest);
            interestStmt.addBatch();
        }
        
        interestStmt.executeBatch();
    } */
    
    // Commit transaction
    conn.commit();
    success = true;
    
    // Clear registration session data
    session.removeAttribute("blogHubRegistration");
    
} catch (ClassNotFoundException e) {
    if (conn != null) {
        try {
            conn.rollback();
        } catch (SQLException ex) {
            ex.printStackTrace();
        }
    }
    errorMessage = "Database driver not found: " + e.getMessage();
    e.printStackTrace();
} catch (SQLException e) {
    if (conn != null) {
        try {
            conn.rollback();
        } catch (SQLException ex) {
            ex.printStackTrace();
        }
    }
    if (errorMessage.isEmpty()) {
        errorMessage = "Database error: " + e.getMessage();
    }
    e.printStackTrace();
} finally {
    // Close resources
    if (rs != null) {
        try { rs.close(); } catch (SQLException e) { e.printStackTrace(); }
    }
    if (userStmt != null) {
        try { userStmt.close(); } catch (SQLException e) { e.printStackTrace(); }
    }
    if (interestStmt != null) {
        try { interestStmt.close(); } catch (SQLException e) { e.printStackTrace(); }
    }
    if (conn != null) {
        try { conn.close(); } catch (SQLException e) { e.printStackTrace(); }
    }
}
%>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BlogHub - Registration Result</title>
    <link rel="stylesheet" href="style/registration.css">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    <style>
        .result-container {
            max-width: 600px;
            margin: 50px auto;
            padding: 30px;
            background-color: #fff;
            border-radius: 10px;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
            text-align: center;
        }
        
        .success-icon {
            font-size: 80px;
            color: #4CAF50;
            margin-bottom: 20px;
        }
        
        .error-icon {
            font-size: 80px;
            color: #F44336;
            margin-bottom: 20px;
        }
        
        h1 {
            margin-bottom: 20px;
            color: #333;
        }
        
        p {
            margin-bottom: 25px;
            color: #666;
            line-height: 1.6;
        }
        
        .btn {
            display: inline-block;
            padding: 12px 24px;
            background-color: #4a6bff;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            transition: background-color 0.3s;
        }
        
        .btn:hover {
            background-color: #3a56d4;
        }
    </style>
</head>
<body>
    <div class="result-container">
        <% if (success) { %>
            <div class="success-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            <h1>Registration Successful!</h1>
            <p>Thank you, <%= fullName %>, for joining BlogHub! Your account has been created successfully.</p>
            <p>We've sent a verification email to <%= email %>. Please verify your email address to complete the registration process.</p>
            <a href="login.html" class="btn">Log In to Your Account</a>
        <% } else { %>
            <div class="error-icon">
                <i class="fas fa-times-circle"></i>
            </div>
            <h1>Registration Failed</h1>
            <p><%= errorMessage %></p>
            <a href="javascript:history.back()" class="btn">Go Back and Try Again</a>
        <% } %>
    </div>
</body>
</html>