<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.sql.*" %>
<%@ page import="jakarta.servlet.http.*" %>
<%@ page import="java.util.*" %>
<%@ page import="java.io.*" %>

<%
// Check if user is logged in by verifying session
String username = (String) session.getAttribute("username");
if (username == null) {
    // Redirect to login page if not logged in
    response.sendRedirect("login1.html");
    return;
}

// Get user ID from session
Integer userId = (Integer) session.getAttribute("userId");
String fullName = (String) session.getAttribute("fullName");
String email = (String) session.getAttribute("email");

// Initialize variables to store user data
String bio = "";
String userType = "creator";
String notificationPreference = "weekly";
boolean publicProfile = true;
boolean allowMentions = true;
boolean contentVisibility = true;
String languagePreference = "en";
List<String> writingInterests = new ArrayList<>();
List<String> readingInterests = new ArrayList<>();
boolean newFollowers = true;
boolean postComments = true;
boolean postLikes = false;
boolean contentMentions = true;
boolean blogRecommendations = true;
boolean marketingEmails = false;
boolean pushComments = true;
boolean pushLikes = false;
boolean pushFollowers = true;

// Handle form submission
String actionType = request.getParameter("action");
String successMessage = "";
String errorMessage = "";

Connection conn = null;
PreparedStatement pstmt = null;
ResultSet rs = null;

try {
    // Load the JDBC driver
    Class.forName("com.mysql.jdbc.Driver");
    
    // Database connection
    String dbURL = "jdbc:mysql://localhost:3306/bloghub";
    String dbUser = "root";
    String dbPassword = "";
    
    conn = DriverManager.getConnection(dbURL, dbUser, dbPassword);
    
    // Process form submission
    if (actionType != null) {
        if (actionType.equals("profile")) {
            // Update profile info
            String newFullName = request.getParameter("name");
            String newUsername = request.getParameter("username");
            String newBio = request.getParameter("bio");
            String newUserType = request.getParameter("user-type");
            
            // Check if username exists and is different from current username
            if (!newUsername.equals(username)) {
                String checkUserSql = "SELECT COUNT(*) FROM user_info WHERE username = ? AND user_id != ?";
                pstmt = conn.prepareStatement(checkUserSql);
                pstmt.setString(1, newUsername);
                pstmt.setInt(2, userId);
                rs = pstmt.executeQuery();
                rs.next();
                if (rs.getInt(1) > 0) {
                    errorMessage = "Username already exists. Please choose a different username.";
                    throw new SQLException("Username already exists");
                }
            }
            
            // Update profile in database
            String updateSql = "UPDATE user_info SET name = ?, username = ?, bio = ?, user_type = ? WHERE user_id = ?";
            pstmt = conn.prepareStatement(updateSql);
            pstmt.setString(1, newFullName);
            pstmt.setString(2, newUsername);
            pstmt.setString(3, newBio != null ? newBio : "");
            pstmt.setString(4, newUserType);
            pstmt.setInt(5, userId);
            
            int result = pstmt.executeUpdate();
            if (result > 0) {
                // Update session attributes
                session.setAttribute("username", newUsername);
                session.setAttribute("fullName", newFullName);
                username = newUsername;
                fullName = newFullName;
                bio = newBio;
                userType = newUserType;
                successMessage = "Profile updated successfully!";
            }
        } else if (actionType.equals("account")) {
            // Update account info
            String newEmail = request.getParameter("email");
            String newPublicProfile = request.getParameter("public-profile");
            String newAllowMentions = request.getParameter("allow-mentions");
            String newContentVisibility = request.getParameter("content-visibility");
            String newLanguagePreference = request.getParameter("language-preference");
            
            // Check if email exists and is different from current email
            if (!newEmail.equals(email)) {
                String checkEmailSql = "SELECT COUNT(*) FROM user_info WHERE email = ? AND user_id != ?";
                pstmt = conn.prepareStatement(checkEmailSql);
                pstmt.setString(1, newEmail);
                pstmt.setInt(2, userId);
                rs = pstmt.executeQuery();
                rs.next();
                if (rs.getInt(1) > 0) {
                    errorMessage = "Email already registered. Please use a different email.";
                    throw new SQLException("Email already exists");
                }
            }
            
            // Update account in database
            String updateSql = "UPDATE user_info SET email = ?, public_profile = ?, allow_mentions = ?, content_visibility = ?, language_preference = ? WHERE user_id = ?";
            pstmt = conn.prepareStatement(updateSql);
            pstmt.setString(1, newEmail);
            pstmt.setBoolean(2, newPublicProfile != null);
            pstmt.setBoolean(3, newAllowMentions != null);
            pstmt.setBoolean(4, newContentVisibility != null);
            pstmt.setString(5, newLanguagePreference);
            pstmt.setInt(6, userId);
            
            int result = pstmt.executeUpdate();
            if (result > 0) {
                // Update session attributes
                session.setAttribute("email", newEmail);
                email = newEmail;
                publicProfile = (newPublicProfile != null);
                allowMentions = (newAllowMentions != null);
                contentVisibility = (newContentVisibility != null);
                languagePreference = newLanguagePreference;
                successMessage = "Account settings updated successfully!";
            }
        } else if (actionType.equals("interests")) {
            // Update interests
            String[] newWritingInterests = request.getParameterValues("interests");
            String[] newReadingInterests = request.getParameterValues("reading-interests");
            
            // Clear old interests
            String clearSql = "DELETE FROM user_interests WHERE user_id = ?";
            pstmt = conn.prepareStatement(clearSql);
            pstmt.setInt(1, userId);
            pstmt.executeUpdate();
            
            // Insert new writing interests
            if (newWritingInterests != null && newWritingInterests.length > 0) {
                String interestSql = "INSERT INTO user_interests (user_id, interest_name, interest_type) VALUES (?, ?, 'writing')";
                pstmt = conn.prepareStatement(interestSql);
                
                for (String interest : newWritingInterests) {
                    pstmt.setInt(1, userId);
                    pstmt.setString(2, interest);
                    pstmt.addBatch();
                }
                
                pstmt.executeBatch();
                writingInterests = Arrays.asList(newWritingInterests);
            }
            
            // Insert new reading interests
            if (newReadingInterests != null && newReadingInterests.length > 0) {
                String readingSql = "INSERT INTO user_interests (user_id, interest_name, interest_type) VALUES (?, ?, 'reading')";
                pstmt = conn.prepareStatement(readingSql);
                
                for (String interest : newReadingInterests) {
                    pstmt.setInt(1, userId);
                    pstmt.setString(2, interest);
                    pstmt.addBatch();
                }
                
                pstmt.executeBatch();
                readingInterests = Arrays.asList(newReadingInterests);
            }
            
            successMessage = "Interests updated successfully!";
        } else if (actionType.equals("notifications")) {
            // Update notification preferences
            String newNotificationPreference = request.getParameter("notification-preference");
            String newFollowersNotif = request.getParameter("new-followers");
            String newPostComments = request.getParameter("post-comments");
            String newPostLikes = request.getParameter("post-likes");
            String newContentMentions = request.getParameter("content-mentions");
            String newBlogRecommendations = request.getParameter("blog-recommendations");
            String newMarketingEmails = request.getParameter("marketing-emails");
            String newPushComments = request.getParameter("push-comments");
            String newPushLikes = request.getParameter("push-likes");
            String newPushFollowers = request.getParameter("push-followers");
            
            // Update notification preferences in database
            String updateSql = "UPDATE user_preferences SET notification_preference = ?, new_followers = ?, post_comments = ?, post_likes = ?, " +
                "content_mentions = ?, blog_recommendations = ?, marketing_emails = ?, push_comments = ?, push_likes = ?, push_followers = ? " +
                "WHERE user_id = ?";
            
            pstmt = conn.prepareStatement(updateSql);
            pstmt.setString(1, newNotificationPreference);
            pstmt.setBoolean(2, newFollowersNotif != null);
            pstmt.setBoolean(3, newPostComments != null);
            pstmt.setBoolean(4, newPostLikes != null);
            pstmt.setBoolean(5, newContentMentions != null);
            pstmt.setBoolean(6, newBlogRecommendations != null);
            pstmt.setBoolean(7, newMarketingEmails != null);
            pstmt.setBoolean(8, newPushComments != null);
            pstmt.setBoolean(9, newPushLikes != null);
            pstmt.setBoolean(10, newPushFollowers != null);
            pstmt.setInt(11, userId);
            
            // Check if record exists
            String checkSql = "SELECT COUNT(*) FROM user_preferences WHERE user_id = ?";
            PreparedStatement checkStmt = conn.prepareStatement(checkSql);
            checkStmt.setInt(1, userId);
            ResultSet checkRs = checkStmt.executeQuery();
            checkRs.next();
            
            if (checkRs.getInt(1) > 0) {
                // Update existing record
                pstmt.executeUpdate();
            } else {
                // Insert new record
                String insertSql = "INSERT INTO user_preferences (user_id, notification_preference, new_followers, post_comments, post_likes, " +
                    "content_mentions, blog_recommendations, marketing_emails, push_comments, push_likes, push_followers) " +
                    "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                
                PreparedStatement insertStmt = conn.prepareStatement(insertSql);
                insertStmt.setInt(1, userId);
                insertStmt.setString(2, newNotificationPreference);
                insertStmt.setBoolean(3, newFollowersNotif != null);
                insertStmt.setBoolean(4, newPostComments != null);
                insertStmt.setBoolean(5, newPostLikes != null);
                insertStmt.setBoolean(6, newContentMentions != null);
                insertStmt.setBoolean(7, newBlogRecommendations != null);
                insertStmt.setBoolean(8, newMarketingEmails != null);
                insertStmt.setBoolean(9, newPushComments != null);
                insertStmt.setBoolean(10, newPushLikes != null);
                insertStmt.setBoolean(11, newPushFollowers != null);
                
                insertStmt.executeUpdate();
                insertStmt.close();
            }
            
            checkRs.close();
            checkStmt.close();
            
            notificationPreference = newNotificationPreference;
            newFollowers = (newFollowersNotif != null);
            postComments = (newPostComments != null);
            postLikes = (newPostLikes != null);
            contentMentions = (newContentMentions != null);
            blogRecommendations = (newBlogRecommendations != null);
            marketingEmails = (newMarketingEmails != null);
            pushComments = (newPushComments != null);
            pushLikes = (newPushLikes != null);
            pushFollowers = (newPushFollowers != null);
            
            successMessage = "Notification preferences updated successfully!";
        } else if (actionType.equals("security")) {
            // Update password
            String currentPassword = request.getParameter("current-password");
            String newPassword = request.getParameter("new-password");
            String confirmNewPassword = request.getParameter("confirm-new-password");
            
            // Validate passwords
            if (currentPassword == null || currentPassword.isEmpty()) {
                errorMessage = "Current password is required.";
                throw new Exception("Current password is required");
            }
            
            if (newPassword == null || newPassword.isEmpty()) {
                errorMessage = "New password is required.";
                throw new Exception("New password is required");
            }
            
            if (!newPassword.equals(confirmNewPassword)) {
                errorMessage = "New passwords do not match.";
                throw new Exception("Passwords do not match");
            }
            
            // Verify current password
            String checkSql = "SELECT password FROM user_info WHERE user_id = ?";
            pstmt = conn.prepareStatement(checkSql);
            pstmt.setInt(1, userId);
            rs = pstmt.executeQuery();
            
            if (rs.next()) {
                String storedPassword = rs.getString("password");
                if (!storedPassword.equals(currentPassword)) {
                    errorMessage = "Current password is incorrect.";
                    throw new Exception("Current password is incorrect");
                }
            } else {
                errorMessage = "User not found.";
                throw new Exception("User not found");
            }
            
            // Update password
            String updateSql = "UPDATE user_info SET password = ? WHERE user_id = ?";
            pstmt = conn.prepareStatement(updateSql);
            
            // In a production environment, you should hash the password
            // Example using a simple hash (not recommended for production)
            // String hashedPassword = org.apache.commons.codec.digest.DigestUtils.sha256Hex(newPassword);
            // pstmt.setString(1, hashedPassword);
            
            // For simplicity, we're storing the password as-is (NEVER do this in production)
            pstmt.setString(1, newPassword);
            pstmt.setInt(2, userId);
            
            int result = pstmt.executeUpdate();
            if (result > 0) {
                successMessage = "Password updated successfully!";
            }
        }
    }
    
    // Fetch user data if it's not a form submission or after successful form submission
    if (actionType == null || !errorMessage.isEmpty() || !successMessage.isEmpty()) {
        // Fetch user info
        String userSql = "SELECT * FROM user_info WHERE user_id = ?";
        pstmt = conn.prepareStatement(userSql);
        pstmt.setInt(1, userId);
        rs = pstmt.executeQuery();
        
        if (rs.next()) {
            fullName = rs.getString("name");
            username = rs.getString("username");
            email = rs.getString("email");
            bio = rs.getString("bio");
            userType = rs.getString("user_type");
            
            // Update session attributes
            session.setAttribute("username", username);
            session.setAttribute("fullName", fullName);
            session.setAttribute("email", email);
        }
        
        // Fetch account preferences
        String prefSql = "SELECT * FROM user_preferences WHERE user_id = ?";
        pstmt = conn.prepareStatement(prefSql);
        pstmt.setInt(1, userId);
        rs = pstmt.executeQuery();
        
        if (rs.next()) {
            publicProfile = rs.getBoolean("public_profile");
            allowMentions = rs.getBoolean("allow_mentions");
            contentVisibility = rs.getBoolean("content_visibility");
            languagePreference = rs.getString("language_preference");
            notificationPreference = rs.getString("notification_preference");
            newFollowers = rs.getBoolean("new_followers");
            postComments = rs.getBoolean("post_comments");
            postLikes = rs.getBoolean("post_likes");
            contentMentions = rs.getBoolean("content_mentions");
            blogRecommendations = rs.getBoolean("blog_recommendations");
            marketingEmails = rs.getBoolean("marketing_emails");
            pushComments = rs.getBoolean("push_comments");
            pushLikes = rs.getBoolean("push_likes");
            pushFollowers = rs.getBoolean("push_followers");
        }
        
        // Fetch user interests
        String interestsSql = "SELECT * FROM user_interests WHERE user_id = ?";
        pstmt = conn.prepareStatement(interestsSql);
        pstmt.setInt(1, userId);
        rs = pstmt.executeQuery();
        
        writingInterests = new ArrayList<>();
        readingInterests = new ArrayList<>();
        
        while (rs.next()) {
            String interestName = rs.getString("interest_name");
            String interestType = rs.getString("interest_type");
            
            if ("writing".equals(interestType)) {
                writingInterests.add(interestName);
            } else if ("reading".equals(interestType)) {
                readingInterests.add(interestName);
            }
        }
    }
} catch (Exception e) {
    if (errorMessage.isEmpty()) {
        errorMessage = "An error occurred: " + e.getMessage();
    }
    e.printStackTrace();
} finally {
    // Close resources
    if (rs != null) try { rs.close(); } catch (SQLException e) {}
    if (pstmt != null) try { pstmt.close(); } catch (SQLException e) {}
    if (conn != null) try { conn.close(); } catch (SQLException e) {}
}

// Set active tab
String activeTab = (actionType != null) ? actionType + "-settings" : "profile-settings";

// Helper function to check if a string is in a list
boolean contains(List<String> list, String item) {
    return list != null && list.contains(item);
}

// Helper function to output checked attribute
String checked(boolean condition) {
    return condition ? "checked" : "";
}

// Helper function to output selected attribute
String selected(String value, String current) {
    return value.equals(current) ? "selected" : "";
}
%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BlogHub - Settings</title>
    <link rel="stylesheet" href="style/setting.css">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            // Tab switching functionality
            document.querySelectorAll('.settings-nav li').forEach(item => {
                item.addEventListener('click', function() {
                    // Remove active class from all tabs and nav items
                    document.querySelectorAll('.settings-tab').forEach(tab => {
                        tab.classList.remove('active');
                    });
                    document.querySelectorAll('.settings-nav li').forEach(navItem => {
                        navItem.classList.remove('active');
                    });
                    
                    // Add active class to selected tab and nav item
                    const tabId = this.getAttribute('data-tab');
                    document.getElementById(tabId).classList.add('active');
                    this.classList.add('active');
                });
            });
            
            // User type selector
            document.querySelectorAll('.user-type-option').forEach(option => {
                option.addEventListener('click', function() {
                    document.querySelectorAll('.user-type-option').forEach(opt => {
                        opt.classList.remove('active');
                    });
                    this.classList.add('active');
                    document.getElementById('user-type-input').value = this.getAttribute('data-type');
                });
            });
            
            // Password visibility toggle
            document.querySelectorAll('.toggle-password').forEach(toggle => {
                toggle.addEventListener('click', function() {
                    const passwordField = document.getElementById(this.getAttribute('data-for'));
                    const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
                    passwordField.setAttribute('type', type);
                    this.classList.toggle('fa-eye');
                    this.classList.toggle('fa-eye-slash');
                });
            });
            
            // Password strength indicator
            const passwordInput = document.getElementById('new-password');
            if (passwordInput) {
                passwordInput.addEventListener('input', function() {
                    const password = this.value;
                    const strengthIndicator = document.getElementById('strength-indicator');
                    const strengthText = document.getElementById('strength-text');
                    
                    if (password.length === 0) {
                        strengthIndicator.style.width = '0%';
                        strengthIndicator.style.backgroundColor = '#e0e0e0';
                        strengthText.textContent = 'Password strength';
                        return;
                    }
                    
                    // Simple password strength calculation
                    let strength = 0;
                    
                    // Length
                    if (password.length > 6) strength += 25;
                    if (password.length > 10) strength += 10;
                    
                    // Complexity
                    if (/[A-Z]/.test(password)) strength += 15;
                    if (/[a-z]/.test(password)) strength += 10;
                    if (/[0-9]/.test(password)) strength += 15;
                    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
                    
                    // Set indicator width and color
                    strengthIndicator.style.width = strength + '%';
                    
                    // Set color based on strength
                    if (strength < 30) {
                        strengthIndicator.style.backgroundColor = '#f44336';
                        strengthText.textContent = 'Weak';
                    } else if (strength < 60) {
                        strengthIndicator.style.backgroundColor = '#ff9800';
                        strengthText.textContent = 'Medium';
                    } else {
                        strengthIndicator.style.backgroundColor = '#4caf50';
                        strengthText.textContent = 'Strong';
                    }
                });
            }
            
            // File input handling for avatar upload
            const avatarInput = document.getElementById('avatar-input');
            const uploadBtn = document.querySelector('.upload-btn');
            
            if (avatarInput && uploadBtn) {
                uploadBtn.addEventListener('click', function() {
                    avatarInput.click();
                });
                
                avatarInput.addEventListener('change', function() {
                    const file = this.files[0];
                    if (file) {
                        const reader = new FileReader();
                        reader.onload = function(e) {
                            document.querySelector('.current-avatar').style.backgroundImage = `url(${e.target.result})`;
                        };
                        reader.readAsDataURL(file);
                    }
                });
            }
            
            // Handle remove avatar button
            const removeBtn = document.querySelector('.remove-btn');
            if (removeBtn) {
                removeBtn.addEventListener('click', function() {
                    document.querySelector('.current-avatar').style.backgroundImage = '';
                    if (avatarInput) avatarInput.value = '';
                });
            }
            
            // Show notification for success/error messages
            <% if (!successMessage.isEmpty()) { %>
            showNotification("<%= successMessage %>", 'success');
            <% } %>
            
            <% if (!errorMessage.isEmpty()) { %>
            showNotification("<%= errorMessage %>", 'error');
            <% } %>
            
            // Function to show notifications
            function showNotification(message, type) {
                // Create notification element
                const notification = document.createElement('div');
                notification.className = `notification ${type}`;
                notification.innerHTML = `
                    <div class="notification-content">
                        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
                        <span>${message}</span>
                    </div>
                    <button class="close-notification"><i class="fas fa-times"></i></button>
                `;
                
                // Add styles
                notification.style.position = 'fixed';
                notification.style.top = '20px';
                notification.style.right = '20px';
                notification.style.padding = '12px 20px';
                notification.style.borderRadius = '5px';
                notification.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                notification.style.display = 'flex';
                notification.style.alignItems = 'center';
                notification.style.justifyContent = 'space-between';
                notification.style.zIndex = '9999';
                notification.style.minWidth = '300px';
                notification.style.maxWidth = '400px';
                
                if (type === 'success') {
                    notification.style.backgroundColor = '#4CAF50';
                    notification.style.color = 'white';
                } else {
                    notification.style.backgroundColor = '#F44336';
                    notification.style.color = 'white';
                }
                
                // Add to document
                document.body.appendChild(notification);
                
                // Add event listener for close button
                notification.querySelector('.close-notification').addEventListener('click', function() {
                    document.body.removeChild(notification);
                });
                
                // Auto close after 5 seconds
                setTimeout(function() {
                    if (document.body.contains(notification)) {
                        document.body.removeChild(notification);
                    }
                }, 5000);
            }
        });
    </script>
</head>
<body>
    <div class="page-wrapper">
        <header class="header">
            <div class="logo">
                <i class="fas fa-feather-alt"></i> BlogHub
            </div>
            <nav class="nav-menu">
                <ul>
                    <li><a href="new_home.html">Home</a></li>
                    <li><a href="features.html">Features</a></li>
                    <li><a href="contact.html">Contact</a></li>
                    <li><a href="aboutus.html">About</a></li>
                    <li class="active"><a href="settings.jsp">Settings</a></li>
                </ul>
            </nav>
            <div class="user-menu">
                <div class="user-avatar"></div>
                <span class="username"><%= username %></span>
                <i class="fas fa-chevron-down"></i>
            </div>
        </header>

        <main>
            <div class="settings-container">
                <div class="settings-sidebar">
                    <h2>Settings</h2>
                    <ul class="settings-nav">
                        <li <%= activeTab.equals("profile-settings") ? "class='active'" : "" %> data-tab="profile-settings"><i class="fas fa-user"></i> Profile</li>
                        <li <%= activeTab.equals("account-settings") ? "class='active'" : "" %> data-tab="account-settings"><i class="fas fa-cog"></i> Account</li>
                        <li <%= activeTab.equals("interests-settings") ? "class='active'" : "" %> data-tab="interests-settings"><i class="fas fa-tags"></i> Interests</li>
                        <li <%= activeTab.equals("notification-settings") ? "class='active'" : "" %> data-tab="notification-settings"><i class="fas fa-bell"></i> Notifications</li>
                        <li <%= activeTab.equals("security-settings") ? "class='active'" : "" %> data-tab="security-settings"><i class="fas fa-shield-alt"></i> Security</li>
                    </ul>
                </div>

                <div class="settings-content">
                    <!-- Profile Settings -->
                    <div id="profile-settings" class="settings-tab <%= activeTab.equals("profile-settings") ? "active" : "" %>">
                        <h2>Profile Settings</h2>
                        <form id="profile-form" action="setting.jsp?action=profile" method="post">
                            <div class="form-group">
                                <label for="settings-full-name">Full Name</label>
                                <div class="input-wrapper">
                                    <i class="fa-solid fa-user input-icon"></i>
                                    <input type="text" id="settings-full-name" name="name" value="<%= fullName %>">
                                </div>
                            </div>
                            
                            <div class="form-group">
                                <label for="settings-username">Username</label>
                                <div class="input-wrapper">
                                    <i class="fa-solid fa-at input-icon"></i>
                                    <input type="text" id="settings-username" name="username" value="<%= username %>">
                                </div>
                            </div>
                            
                            <div class="form-group">
                                <label for="settings-bio">Bio</label>
                                <div class="input-wrapper textarea-wrapper">
                                    <i class="fa-solid fa-comment input-icon"></i>
                                    <textarea id="settings-bio" name="bio" rows="3"><%= bio %></textarea>
                                </div>
                            </div>

                            <div class="form-group">
                                <label>Profile Picture</label>
                                <div class="avatar-upload">
                                    <div class="current-avatar"></div>
                                    <div class="upload-actions">
                                        <button type="button" class="upload-btn">
                                            <i class="fas fa-upload"></i> Upload new image
                                        </button>
                                        <input type="file" id="avatar-input" accept="image/*" hidden>
                                        <button type="button" class="remove-btn">
                                            <i class="fas fa-trash"></i> Remove
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div class="form-group user-type-group">
                                <label>Account Type</label>
                                <div class="user-type-selector">
                                    <div class="user-type-option creator <%= userType.equals("creator") ? "active" : "" %>" data-type="creator">
                                        <div class="option-icon">
                                            <i class="fas fa-pen-fancy"></i>
                                        </div>
                                        <div class="option-text">
                                            <h3>Creator</h3>
                                            <p>Write and publish content</p>
                                        </div>
                                    </div>
                                    <%-- Continuing from where the code was cut off --%>
                                    <div class="user-type-option viewer <%= userType.equals("viewer") ? "active" : "" %>" data-type="viewer">
                                        <div class="option-icon">
                                            <i class="fas fa-book-reader"></i>
                                        </div>
                                        <div class="option-text">
                                            <h3>Reader</h3>
                                            <p>Explore and read content</p>
                                        </div>
                                    </div>
                                </div>
                                <input type="hidden" id="user-type-input" name="user-type" value="<%= userType %>">
                            </div>

                            <button type="submit" class="save-btn">
                                <span>Save Changes</span>
                            </button>
                        </form>
                    </div>

                    <!-- Account Settings -->
                    <div id="account-settings" class="settings-tab <%= activeTab.equals("account-settings") ? "active" : "" %>">
                        <h2>Account Settings</h2>
                        <form id="account-form" action="setting.jsp?action=account" method="post">
                            <div class="form-group">
                                <label for="settings-email">Email Address</label>
                                <div class="input-wrapper">
                                    <i class="fa-solid fa-envelope input-icon"></i>
                                    <input type="email" id="settings-email" name="email" value="<%= email %>">
                                </div>
                            </div>

                            <div class="form-group">
                                <label>Account Preferences</label>
                                <div class="checkbox-option">
                                    <input type="checkbox" id="public-profile" name="public-profile" <%= checked(publicProfile) %>>
                                    <label for="public-profile">Make my profile public</label>
                                </div>
                                <div class="checkbox-option">
                                    <input type="checkbox" id="allow-mentions" name="allow-mentions" <%= checked(allowMentions) %>>
                                    <label for="allow-mentions">Allow others to mention me in comments</label>
                                </div>
                                <div class="checkbox-option">
                                    <input type="checkbox" id="content-visibility" name="content-visibility" <%= checked(contentVisibility) %>>
                                    <label for="content-visibility">Show my content in discovery feeds</label>
                                </div>
                            </div>

                            <div class="form-group">
                                <label for="language-preference">Language Preference</label>
                                <div class="input-wrapper select-wrapper">
                                    <i class="fa-solid fa-globe input-icon"></i>
                                    <select id="language-preference" name="language-preference">
                                        <option value="en" <%= selected("en", languagePreference) %>>English</option>
                                        <option value="es" <%= selected("es", languagePreference) %>>Spanish</option>
                                        <option value="fr" <%= selected("fr", languagePreference) %>>French</option>
                                        <option value="de" <%= selected("de", languagePreference) %>>German</option>
                                        <option value="ja" <%= selected("ja", languagePreference) %>>Japanese</option>
                                    </select>
                                    <i class="fas fa-chevron-down select-arrow"></i>
                                </div>
                            </div>

                            <div class="danger-zone">
                                <h3>Danger Zone</h3>
                                <button type="button" class="deactivate-btn">
                                    <i class="fas fa-user-slash"></i> Deactivate Account
                                </button>
                                <button type="button" class="delete-btn">
                                    <i class="fas fa-trash"></i> Delete Account
                                </button>
                            </div>

                            <button type="submit" class="save-btn">
                                <span>Save Changes</span>
                            </button>
                        </form>
                    </div>

                    <!-- Interests Settings -->
                    <div id="interests-settings" class="settings-tab <%= activeTab.equals("interests-settings") ? "active" : "" %>">
                        <h2>Interests Settings</h2>
                        <form id="interests-form" action="setting.jsp?action=interests" method="post">
                            <div class="form-group creator-field">
                                <label>Writing Interests</label>
                                <p class="interests-subtitle">Topics you're interested in writing about</p>
                                <div class="interests-container">
                                    <div class="interest-chip">
                                        <input type="checkbox" id="tech" name="interests" value="technology" <%= contains(writingInterests, "technology") ? "checked" : "" %>>
                                        <label for="tech"><i class="fas fa-microchip"></i> Technology</label>
                                    </div>
                                    <div class="interest-chip">
                                        <input type="checkbox" id="lifestyle" name="interests" value="lifestyle" <%= contains(writingInterests, "lifestyle") ? "checked" : "" %>>
                                        <label for="lifestyle"><i class="fas fa-spa"></i> Lifestyle</label>
                                    </div>
                                    <div class="interest-chip">
                                        <input type="checkbox" id="health" name="interests" value="health" <%= contains(writingInterests, "health") ? "checked" : "" %>>
                                        <label for="health"><i class="fas fa-heartbeat"></i> Health</label>
                                    </div>
                                    <div class="interest-chip">
                                        <input type="checkbox" id="travel" name="interests" value="travel" <%= contains(writingInterests, "travel") ? "checked" : "" %>>
                                        <label for="travel"><i class="fas fa-plane"></i> Travel</label>
                                    </div>
                                    <div class="interest-chip">
                                        <input type="checkbox" id="food" name="interests" value="food" <%= contains(writingInterests, "food") ? "checked" : "" %>>
                                        <label for="food"><i class="fas fa-utensils"></i> Food</label>
                                    </div>
                                    <div class="interest-chip">
                                        <input type="checkbox" id="business" name="interests" value="business" <%= contains(writingInterests, "business") ? "checked" : "" %>>
                                        <label for="business"><i class="fas fa-chart-line"></i> Business</label>
                                    </div>
                                    <div class="interest-chip">
                                        <input type="checkbox" id="art" name="interests" value="art" <%= contains(writingInterests, "art") ? "checked" : "" %>>
                                        <label for="art"><i class="fas fa-palette"></i> Art</label>
                                    </div>
                                    <div class="interest-chip">
                                        <input type="checkbox" id="science" name="interests" value="science" <%= contains(writingInterests, "science") ? "checked" : "" %>>
                                        <label for="science"><i class="fas fa-flask"></i> Science</label>
                                    </div>
                                    <div class="interest-chip">
                                        <input type="checkbox" id="fiction" name="interests" value="fiction" <%= contains(writingInterests, "fiction") ? "checked" : "" %>>
                                        <label for="fiction"><i class="fas fa-book"></i> Fiction</label>
                                    </div>
                                    <div class="interest-chip">
                                        <input type="checkbox" id="poetry" name="interests" value="poetry" <%= contains(writingInterests, "poetry") ? "checked" : "" %>>
                                        <label for="poetry"><i class="fas fa-feather"></i> Poetry</label>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="form-group viewer-field">
                                <label>Reading Interests</label>
                                <p class="interests-subtitle">Topics you're interested in reading about</p>
                                <div class="interests-container">
                                    <div class="interest-chip">
                                        <input type="checkbox" id="tech-read" name="reading-interests" value="technology" <%= contains(readingInterests, "technology") ? "checked" : "" %>>
                                        <label for="tech-read"><i class="fas fa-microchip"></i> Technology</label>
                                    </div>
                                    <div class="interest-chip">
                                        <input type="checkbox" id="lifestyle-read" name="reading-interests" value="lifestyle" <%= contains(readingInterests, "lifestyle") ? "checked" : "" %>>
                                        <label for="lifestyle-read"><i class="fas fa-spa"></i> Lifestyle</label>
                                    </div>
                                    <div class="interest-chip">
                                        <input type="checkbox" id="health-read" name="reading-interests" value="health" <%= contains(readingInterests, "health") ? "checked" : "" %>>
                                        <label for="health-read"><i class="fas fa-heartbeat"></i> Health</label>
                                    </div>
                                    <div class="interest-chip">
                                        <input type="checkbox" id="travel-read" name="reading-interests" value="travel" <%= contains(readingInterests, "travel") ? "checked" : "" %>>
                                        <label for="travel-read"><i class="fas fa-plane"></i> Travel</label>
                                    </div>
                                    <div class="interest-chip">
                                        <input type="checkbox" id="food-read" name="reading-interests" value="food" <%= contains(readingInterests, "food") ? "checked" : "" %>>
                                        <label for="food-read"><i class="fas fa-utensils"></i> Food</label>
                                    </div>
                                    <div class="interest-chip">
                                        <input type="checkbox" id="business-read" name="reading-interests" value="business" <%= contains(readingInterests, "business") ? "checked" : "" %>>
                                        <label for="business-read"><i class="fas fa-chart-line"></i> Business</label>
                                    </div>
                                    <div class="interest-chip">
                                        <input type="checkbox" id="art-read" name="reading-interests" value="art" <%= contains(readingInterests, "art") ? "checked" : "" %>>
                                        <label for="art-read"><i class="fas fa-palette"></i> Art</label>
                                    </div>
                                    <div class="interest-chip">
                                        <input type="checkbox" id="science-read" name="reading-interests" value="science" <%= contains(readingInterests, "science") ? "checked" : "" %>>
                                        <label for="science-read"><i class="fas fa-flask"></i> Science</label>
                                    </div>
                                    <div class="interest-chip">
                                        <input type="checkbox" id="fiction-read" name="reading-interests" value="fiction" <%= contains(readingInterests, "fiction") ? "checked" : "" %>>
                                        <label for="fiction-read"><i class="fas fa-book"></i> Fiction</label>
                                    </div>
                                    <div class="interest-chip">
                                        <input type="checkbox" id="poetry-read" name="reading-interests" value="poetry" <%= contains(readingInterests, "poetry") ? "checked" : "" %>>
                                        <label for="poetry-read"><i class="fas fa-feather"></i> Poetry</label>
                                    </div>
                                </div>
                            </div>

                            <button type="submit" class="save-btn">
                                <span>Save Changes</span>
                            </button>
                        </form>
                    </div>

                    <!-- Notification Settings -->
                    <div id="notification-settings" class="settings-tab <%= activeTab.equals("notification-settings") ? "active" : "" %>">
                        <h2>Notification Settings</h2>
                        <form id="notification-form" action="setting.jsp?action=notifications" method="post">
                            <div class="form-group">
                                <label for="notification-preference">Email Digest Frequency</label>
                                <div class="input-wrapper select-wrapper">
                                    <i class="fa-solid fa-bell input-icon"></i>
                                    <select id="notification-preference" name="notification-preference">
                                        <option value="daily" <%= selected("daily", notificationPreference) %>>Daily digest</option>
                                        <option value="weekly" <%= selected("weekly", notificationPreference) %>>Weekly digest</option>
                                        <option value="important" <%= selected("important", notificationPreference) %>>Important updates only</option>
                                        <option value="none" <%= selected("none", notificationPreference) %>>No notifications</option>
                                    </select>
                                    <i class="fas fa-chevron-down select-arrow"></i>
                                </div>
                            </div>

                            <div class="form-group">
                                <label>Email Notifications</label>
                                <div class="checkbox-option">
                                    <input type="checkbox" id="new-followers" name="new-followers" <%= checked(newFollowers) %>>
                                    <label for="new-followers">New followers</label>
                                </div>
                                <div class="checkbox-option">
                                    <input type="checkbox" id="post-comments" name="post-comments" <%= checked(postComments) %>>
                                    <label for="post-comments">Comments on my posts</label>
                                </div>
                                <div class="checkbox-option">
                                    <input type="checkbox" id="post-likes" name="post-likes" <%= checked(postLikes) %>>
                                    <label for="post-likes">Likes on my posts</label>
                                </div>
                                <div class="checkbox-option">
                                    <input type="checkbox" id="content-mentions" name="content-mentions" <%= checked(contentMentions) %>>
                                    <label for="content-mentions">Mentions in comments or posts</label>
                                </div>
                                <div class="checkbox-option">
                                    <input type="checkbox" id="blog-recommendations" name="blog-recommendations" <%= checked(blogRecommendations) %>>
                                    <label for="blog-recommendations">Content recommendations</label>
                                </div>
                                <div class="checkbox-option">
                                    <input type="checkbox" id="marketing-emails" name="marketing-emails" <%= checked(marketingEmails) %>>
                                    <label for="marketing-emails">News and updates from BlogHub</label>
                                </div>
                            </div>

                            <div class="form-group">
                                <label>Push Notifications</label>
                                <div class="checkbox-option">
                                    <input type="checkbox" id="push-comments" name="push-comments" <%= checked(pushComments) %>>
                                    <label for="push-comments">Comments on my posts</label>
                                </div>
                                <div class="checkbox-option">
                                    <input type="checkbox" id="push-likes" name="push-likes" <%= checked(pushLikes) %>>
                                    <label for="push-likes">Likes on my posts</label>
                                </div>
                                <div class="checkbox-option">
                                    <input type="checkbox" id="push-followers" name="push-followers" <%= checked(pushFollowers) %>>
                                    <label for="push-followers">New followers</label>
                                </div>
                            </div>

                            <button type="submit" class="save-btn">
                                <span>Save Changes</span>
                            </button>
                        </form>
                    </div>

                    <!-- Security Settings -->
                    <div id="security-settings" class="settings-tab <%= activeTab.equals("security-settings") ? "active" : "" %>">
                        <h2>Security Settings</h2>
                        <form id="security-form" action="setting.jsp?action=security" method="post">
                            <div class="form-group">
                                <label for="current-password">Current Password</label>
                                <div class="input-wrapper">
                                    <i class="fa-solid fa-lock input-icon"></i>
                                    <input type="password" id="current-password" name="current-password" placeholder="Enter your current password">
                                    <i class="fas fa-eye-slash toggle-password" data-for="current-password"></i>
                                </div>
                            </div>
                            
                            <div class="form-group">
                                <label for="new-password">New Password</label>
                                <div class="input-wrapper">
                                    <i class="fa-solid fa-lock input-icon"></i>
                                    <input type="password" id="new-password" name="new-password" placeholder="Create a new password">
                                    <i class="fas fa-eye-slash toggle-password" data-for="new-password"></i>
                                </div>
                                <div class="password-strength" id="password-strength">
                                    <div class="strength-meter">
                                        <div class="strength-indicator" id="strength-indicator"></div>
                                    </div>
                                    <p id="strength-text">Password strength</p>
                                </div>
                            </div>
                            
                            <div class="form-group">
                                <label for="confirm-new-password">Confirm New Password</label>
                                <div class="input-wrapper">
                                    <i class="fa-solid fa-shield-alt input-icon"></i>
                                    <input type="password" id="confirm-new-password" name="confirm-new-password" placeholder="Re-enter your new password">
                                </div>
                            </div>

                            <div class="form-group">
                                <label>Two-Factor Authentication</label>
                                <div class="tfa-status">
                                    <div class="status-indicator disabled"></div>
                                    <div class="status-text">
                                        <p class="status-title">Two-Factor Authentication is disabled</p>
                                        <p class="status-desc">Enable two-factor authentication for enhanced account security</p>
                                    </div>
                                    <button type="button" class="tfa-toggle-btn">Enable</button>
                                </div>
                            </div>

                            <div class="form-group">
                                <label>Connected Social Accounts</label>
                                <div class="social-connections">
                                    <div class="social-connection">
                                        <div class="connection-icon google-icon">
                                            <i class="fab fa-google"></i>
                                        </div>
                                        <div class="connection-details">
                                            <p class="connection-name">Google</p>
                                            <p class="connection-email"><%= email %></p>
                                        </div>
                                        <button type="button" class="disconnect-btn">Disconnect</button>
                                    </div>
                                    <div class="social-connection">
                                        <div class="connection-icon facebook-icon">
                                            <i class="fab fa-facebook-f"></i>
                                        </div>
                                        <div class="connection-details">
                                            <p class="connection-name">Facebook</p>
                                            <p class="connection-status">Not connected</p>
                                        </div>
                                        <button type="button" class="connect-btn">Connect</button>
                                    </div>
                                    <div class="social-connection">
                                        <div class="connection-icon twitter-icon">
                                            <i class="fab fa-twitter"></i>
                                        </div>
                                        <div class="connection-details">
                                            <p class="connection-name">Twitter</p>
                                            <p class="connection-status">Not connected</p>
                                        </div>
                                        <button type="button" class="connect-btn">Connect</button>
                                    </div>
                                </div>
                            </div>

                            <div class="form-group">
                                <label>Session Management</label>
                                <div class="session-list">
                                    <div class="session-item current">
                                        <div class="session-icon">
                                            <i class="fas fa-laptop"></i>
                                        </div>
                                        <div class="session-details">
                                            <p class="device-name">
                                                <%= request.getHeader("User-Agent").contains("Mobile") ? "Mobile Browser" : 
                                                    (request.getHeader("User-Agent").contains("Chrome") ? "Chrome" : 
                                                    (request.getHeader("User-Agent").contains("Firefox") ? "Firefox" : 
                                                    (request.getHeader("User-Agent").contains("Safari") ? "Safari" : "Unknown Browser"))) %>
                                            </p>
                                            <p class="session-info">Current session • Active now</p>
                                        </div>
                                    </div>
                                    <%-- This would typically come from a database query of active sessions --%>
                                    <div class="session-item">
                                        <div class="session-icon">
                                            <i class="fas fa-mobile-alt"></i>
                                        </div>
                                        <div class="session-details">
                                            <p class="device-name">Mobile App</p>
                                            <p class="session-info">Active 2 days ago</p>
                                        </div>
                                        <button type="button" class="logout-btn">Log out</button>
                                    </div>
                                </div>
                                <button type="button" class="logout-all-btn">
                                    <i class="fas fa-sign-out-alt"></i> Log out of all other devices
                                </button>
                            </div>

                            <button type="submit" class="save-btn">
                                <span>Save Changes</span>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </main>

        <footer class="footer">
            <div class="footer-content">
                <div class="footer-logo">
                    <i class="fas fa-feather-alt"></i> BlogHub
                </div>
                <div class="footer-links">
                    <a href="aboutus.html">About</a>
                    <a href="help.html">Help</a>
                    <a href="terms.html">Terms</a>
                    <a href="privacy.html">Privacy</a>
                </div>
                <div class="copyright">
                    &copy; 2025 BlogHub. All rights reserved.
                </div>
            </div>
        </footer>
    </div>
    
    <%-- No need to include the external script since we have embedded the JS in the page --%>
</body>
</html>