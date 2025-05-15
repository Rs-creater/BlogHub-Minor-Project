<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.util.List" %>
<%@ page import="com.postapp.model.Post" %>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>View All Posts</title>
<link rel="stylesheet" href="style/style.css">
</head>
<body>
<div class="container">
<header>
<h1>All Posts</h1>
<nav>
<ul>
<li><a href="home.jsp">Home</a></li>
<li><a href="createPost.jsp">Create Post</a></li>
<li><a href="getPosts">View Posts</a></li>
</ul>
</nav>
</header>

<section>
<%
List<Post> posts = (List<Post>) request.getAttribute("posts");
if(posts != null && !posts.isEmpty()) {
%>
<div class="post-grid">
<% for(Post post : posts) { %>
<div class="post-card">
<% if(post.getImagePath() != null && !post.getImagePath().isEmpty()) { %>
<img src="<%= post.getImagePath() %>" alt="<%= post.getTitle() %>" class="post-image">
<% } %>

<% if(post.getVideoPath() != null && !post.getVideoPath().isEmpty()) { 
    System.out.println("Video path: " + post.getVideoPath());
%>
<video class="post-video" controls preload="metadata">
<source src="<%= post.getVideoPath() %>" type="video/mp4">
Your browser does not support the video tag.
</video>
<% } %>

<div class="post-content">
<h3><%= post.getTitle() %></h3>
<p><%= post.getDescription() %></p>
<div class="post-time">Posted on: <%= post.getCreatedAt() %></div>
</div>
</div>
<% } %>
</div>
<% } else { %>
<div style="text-align: center; margin: 40px 0;">
<p>No posts found. Create a new post!</p>
<a href="createPost.jsp" class="btn" style="margin-top: 20px;">Create Post</a>
</div>
<% } %>
</section>
</div>
</body>
</html>