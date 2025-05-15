<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.sql.*" %>
<%@ page import="jakarta.servlet.http.*" %>

<%
// Check if user is logged in
String username = (String) session.getAttribute("username");
String fullName = (String) session.getAttribute("fullName");
Integer userId = (Integer) session.getAttribute("userId");

// If not logged in, redirect to login page
if (username == null) {
    response.sendRedirect("login1.html");
    return;
}

// If remember me cookie exists, update session
Cookie[] cookies = request.getCookies();
if (cookies != null) {
    for (Cookie cookie : cookies) {
        if (cookie.getName().equals("username") && username == null) {
            // Get user info from database using cookie value
            // This is a simplified example - in production you'd want to validate this token
            username = cookie.getValue();
            session.setAttribute("username", username);
        }
    }
}
%>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
    <meta http-equiv="Pragma" content="no-cache">
    <meta http-equiv="Expires" content="0">
    <title>BlogHub | Your Knowledge Portal</title>
    <link rel="stylesheet" href="home.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>
    <header>
        <nav class="navbar">
            <div class="logo">
                <h1><span class="logo-accent">Blog</span>Hub</h1>
            </div>
            <ul class="nav-links">
                <li><a href="home.jsp" class="active">Home</a></li>
                <li><a href="aboutus.html">About Us</a></li>
                <li><a href="features.html">Features</a></li>
                <li><a href="contact.html">Contact</a></li>
            </ul>
            <div class="search-container">
                <div class="search-box">
                    <input type="text" id="searchInput" placeholder="Discover articles...">
                    <button class="search-button">
                        <i class="fas fa-search"></i>
                    </button>
                </div>
                <div class="search-categories" id="searchCategories">
                    <h3>Explore Topics</h3>
                    <div class="category-boxes">
                        <div class="category-box">
                            <i class="fas fa-newspaper"></i>
                            <span>News</span>
                        </div>
                        <div class="category-box">
                            <i class="fas fa-futbol"></i>
                            <span>Sports</span>
                        </div>
                        <div class="category-box">
                            <i class="fas fa-landmark"></i>
                            <span>Politics</span>
                        </div>
                        <div class="category-box">
                            <i class="fas fa-microchip"></i>
                            <span>Technology</span>
                        </div>
                        <div class="category-box">
                            <i class="fas fa-utensils"></i>
                            <span>Food</span>
                        </div>
                        <div class="category-box">
                            <i class="fas fa-film"></i>
                            <span>Entertainment</span>
                        </div>
                        <div class="category-box">
                            <i class="fas fa-chart-line"></i>
                            <span>Business</span>
                        </div>
                        <div class="category-box">
                            <i class="fas fa-flask"></i>
                            <span>Science</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="profile-container">
                <div class="profile-icon" id="profileIcon">
                    <i class="fas fa-user-circle"></i>
                </div>
                <div class="dropdown-menu" id="profileDropdown">
                    <div class="dropdown-header">
                        <i class="fas fa-user-circle dropdown-avatar"></i>
                        <span id="username-display"><%= username %></span>
                    </div>
                    <ul>
                        <li><a href="profile.html"><i class="fas fa-user"></i> Profile</a></li>
                        <li><a href="setting.html"><i class="fas fa-cog"></i> Settings</a></li>
                        <li><a href="createPost.jsp"><i class="fas fa-edit"></i> New Post</a></li>
                        <li><a href="logout.jsp"><i class="fas fa-sign-out-alt"></i> Logout</a></li>
                    </ul>
                </div>
            </div>
        </nav>
    </header>

    <div class="hero-banner">
        <div class="hero-content">
            <h2>Explore. Learn. Grow.</h2>
            <p>Discover insights from experts and enthusiasts across various domains</p>
            <a href="#featured" class="cta-button">Start Exploring</a>
        </div>
    </div>

    <div class="featured-categories">
        <div class="category-item tech">
            <div class="category-overlay">
                <i class="fas fa-microchip"></i>
                <h3>Technology</h3>
            </div>
        </div>
        <div class="category-item science">
            <div class="category-overlay">
                <i class="fas fa-flask"></i>
                <h3>Science</h3>
            </div>
        </div>
        <div class="category-item arts">
            <div class="category-overlay">
                <i class="fas fa-palette"></i>
                <h3>Arts</h3>
            </div>
        </div>
        <div class="category-item health">
            <div class="category-overlay">
                <i class="fas fa-heartbeat"></i>
                <h3>Health</h3>
            </div>
        </div>
    </div>

    <div class="container" id="featured">
        <!-- Trending sidebar -->
        <div class="box" id="box-1">
            <div class="sidebar-header">
                <h2>Trending Now</h2>
                <div class="sidebar-filters">
                    <span class="filter active">All</span>
                    <span class="filter">Tech</span>
                    <span class="filter">Science</span>
                </div>
            </div>
            <div class="container-side">
                <% 
                // Get trending articles from database
                Connection conn = null;
                PreparedStatement pstmt = null;
                ResultSet rs = null;
                
                try {
                    Class.forName("com.mysql.jdbc.Driver");
                    String dbURL = "jdbc:mysql://localhost:3306/bloghub";
                    String dbUser = "root";
                    String dbPassword = "";
                    
                    conn = DriverManager.getConnection(dbURL, dbUser, dbPassword);
                    
                    // Get trending articles
                    String sql = "SELECT * FROM articles ORDER BY views DESC LIMIT 8";
                    pstmt = conn.prepareStatement(sql);
                    rs = pstmt.executeQuery();
                    
                    // Display trending articles
                    while(rs.next()) {
                        String articleTitle = rs.getString("title");
                        String articleImage = rs.getString("image_url");
                        String articleCategory = rs.getString("category");
                        String timeAgo = rs.getString("created_at"); // In a real app, calculate time difference
                        int views = rs.getInt("views");
                        
                        // Format views to show K for thousands
                        String formattedViews = views > 999 ? String.format("%.1fK", views/1000.0) : String.valueOf(views);
                %>
                <div class="item">
                    <div class="item-image">
                        <img src="<%= articleImage %>" alt="<%= articleTitle %>">
                        <div class="item-category <%= articleCategory.toLowerCase() %>"><%= articleCategory %></div>
                    </div>
                    <div class="img-content">
                        <a href="article.jsp?id=<%= rs.getInt("id") %>"><%= articleTitle %></a>
                        <div class="item-meta">
                            <span><i class="far fa-clock"></i> <%= timeAgo %></span>
                            <span><i class="far fa-eye"></i> <%= formattedViews %></span>
                        </div>
                    </div>
                </div>
                <% 
                    }
                } catch (Exception e) {
                    // If database error, display static content
                %>
                <div class="item">
                    <div class="item-image">
                        <img src="img/side-1.jpg" alt="Coding article">
                        <div class="item-category tech">Tech</div>
                    </div>
                    <div class="img-content">
                        <a href="#">Unlocking the World of Coding: Build, Innovate, Transform</a>
                        <div class="item-meta">
                            <span><i class="far fa-clock"></i> 2 days ago</span>
                            <span><i class="far fa-eye"></i> 1.2K</span>
                        </div>
                    </div>
                </div>

                <div class="item">
                    <div class="item-image">
                        <img src="img/side-2.png" alt="Space exploration">
                        <div class="item-category science">Science</div>
                    </div>
                    <div class="img-content">
                        <a href="#">Humans in Space: Pushing Boundaries Beyond Earth</a>
                        <div class="item-meta">
                            <span><i class="far fa-clock"></i> 3 days ago</span>
                            <span><i class="far fa-eye"></i> 3.4K</span>
                        </div>
                    </div>
                </div>

                <div class="item">
                    <div class="item-image">
                        <img src="img/side-3.jpg" alt="Mars mission">
                        <div class="item-category science">Science</div>
                    </div>
                    <div class="img-content">
                        <a href="#">India's Mars Mission: A Giant Leap for Space Exploration</a>
                        <div class="item-meta">
                            <span><i class="far fa-clock"></i> 1 week ago</span>
                            <span><i class="far fa-eye"></i> 5.7K</span>
                        </div>
                    </div>
                </div>

                <div class="item">
                    <div class="item-image">
                        <img src="img/coder.jpg" alt="AI programming">
                        <div class="item-category tech">Tech</div>
                    </div>
                    <div class="img-content">
                        <a href="#">AI in Programming: Revolutionizing the Coding Landscape</a>
                        <div class="item-meta">
                            <span><i class="far fa-clock"></i> 4 days ago</span>
                            <span><i class="far fa-eye"></i> 2.8K</span>
                        </div>
                    </div>
                </div>
                <% 
                } finally {
                    if (rs != null) try { rs.close(); } catch (SQLException e) {}
                    if (pstmt != null) try { pstmt.close(); } catch (SQLException e) {}
                    if (conn != null) try { conn.close(); } catch (SQLException e) {}
                }
                %>
            </div>
            <div class="view-more">
                <a href="articles.jsp" class="view-more-btn">View More Articles <i class="fas fa-arrow-right"></i></a>
            </div>
        </div>

        <!-- Featured article -->
        <div class="box featured-article" id="hero">
            <div class="featured-tag">
                <i class="fas fa-star"></i> Featured
            </div>
            <div class="hero-heading">
                <div class="button-div">AI & Technology</div>
                <p>Unraveling the Power of Large Language Models: The Future of AI</p>  
                <div class="article-meta">
                    <span><i class="far fa-user"></i> By Sarah Johnson</span>
                    <span><i class="far fa-calendar"></i> April 7, 2025</span>
                    <span><i class="far fa-comment"></i> 24 Comments</span>
                </div>
                <a href="article.jsp?id=1" class="read-more">Read Full Article <i class="fas fa-arrow-right"></i></a>
            </div>
        </div>

        <!-- Content boxes -->
        <div class="box content-box" id="box-3">
            <div class="content">  
                <div class="button-div">Space Exploration</div>
                <p>The Journey of Humans in Space: Past, Present, and Future</p>
                <div class="article-meta">
                    <span><i class="far fa-user"></i> By Michael Chen</span>
                </div>
                <a href="article.jsp?id=2" class="read-more">Explore <i class="fas fa-arrow-right"></i></a>
            </div>
        </div>
        <div class="box content-box" id="box-4">
            <div class="content">  
                <div class="button-div">Coding</div>
                <p>The Programmer's Journey: From Novice to Expert</p>
                <div class="article-meta">
                    <span><i class="far fa-user"></i> By Alex Rivera</span>
                </div>
                <a href="article.jsp?id=3" class="read-more">Discover <i class="fas fa-arrow-right"></i></a>
            </div>
        </div>
        <div class="box content-box" id="box-5">
            <div class="content">  
                <div class="button-div">Education</div>
                <p>New Education Policy: Transforming Learning for Tomorrow</p>
                <div class="article-meta">
                    <span><i class="far fa-user"></i> By Priya Sharma</span>
                </div>
                <a href="article.jsp?id=4" class="read-more">Learn More <i class="fas fa-arrow-right"></i></a>
            </div>
        </div>
        <div class="box content-box" id="box-6">
            <div class="content">  
                <div class="button-div">Medical Science</div>
                <p>Ancient Medicine vs Modern Medicine: Finding Balance</p>
                <div class="article-meta">
                    <span><i class="far fa-user"></i> By Dr. James Wilson</span>
                </div>
                <a href="article.jsp?id=5" class="read-more">Investigate <i class="fas fa-arrow-right"></i></a>
            </div>
        </div>
    </div>

    <div class="newsletter-section">
        <div class="newsletter-content">
            <i class="far fa-envelope-open"></i>
            <h2>Stay Updated</h2>
            <p>Subscribe to our newsletter to receive the latest insights directly in your inbox</p>
            <form class="newsletter-form" action="subscribe.jsp" method="post">
                <input type="email" name="email" placeholder="Enter your email address" required>
                <button type="submit">Subscribe</button>
            </form>
        </div>
    </div>

    <footer>
        <div class="footer-content">
            <div class="footer-section about">
                <h3>About InsightHub</h3>
                <p>InsightHub is a premier platform dedicated to sharing knowledge and insights across technology, science, education, and more - empowering minds for a brighter future.</p>
                <div class="social-media">
                    <a href="#"><i class="fab fa-facebook"></i></a>
                    <a href="#"><i class="fab fa-twitter"></i></a>
                    <a href="#"><i class="fab fa-instagram"></i></a>
                    <a href="#"><i class="fab fa-linkedin"></i></a>
                </div>
            </div>
            <div class="footer-section links">
                <h3>Quick Links</h3>
                <ul>
                    <li><a href="home.jsp"><i class="fas fa-angle-right"></i> Home</a></li>
                    <li><a href="aboutus.html"><i class="fas fa-angle-right"></i> About Us</a></li>
                    <li><a href="features.html"><i class="fas fa-angle-right"></i> Features</a></li>
                    <li><a href="contact.html"><i class="fas fa-angle-right"></i> Contact</a></li>
                    <li><a href="privacy.html"><i class="fas fa-angle-right"></i> Privacy Policy</a></li>
                    <li><a href="terms.html"><i class="fas fa-angle-right"></i> Terms of Service</a></li>
                </ul>
            </div>
            <div class="footer-section contact">
                <h3>Contact Us</h3>
                <div class="contact-info">
                    <p><i class="fas fa-map-marker-alt"></i> 123 Knowledge Street, Insight City</p>
                    <p><i class="fas fa-envelope"></i> contact@insighthub.com</p>
                    <p><i class="fas fa-phone"></i> +1 (555) 123-4567</p>
                </div>
            </div>
            <div class="footer-section subscribe">
                <h3>Subscribe</h3>
                <p>Stay updated with our latest articles and insights</p>
                <form action="subscribe.jsp" method="post">
                    <input type="email" name="email" placeholder="Enter your email" required>
                    <button type="submit">Subscribe</button>
                </form>
            </div>
        </div>
        <div class="footer-bottom">
            <p>&copy; 2025 InsightHub. All rights reserved.</p>
        </div>
    </footer>

    <script>
    // Store username in localStorage for client-side access
    localStorage.setItem('username', '<%= username %>');
    </script>
    <script src="home.js"></script>
</body>
</html>