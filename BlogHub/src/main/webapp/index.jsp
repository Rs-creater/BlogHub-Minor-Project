<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Post Upload App</title>
    <link rel="stylesheet" href="style/style.css">
</head>
<body>
    <div class="container">
        <header>
            <h1>Welcome to Post Upload App</h1>
            <nav>
                <ul>
                    <li><a href="index.jsp">Home</a></li>
                    <li><a href="createPost.jsp">Create Post</a></li>
                    <li><a href="getPosts">View Posts</a></li>
                </ul>
            </nav>
        </header>
        
        <section>
            <h2>What would you like to do?</h2>
            <div style="display: flex; justify-content: center; gap: 20px; margin-top: 40px;">
                <a href="createPost.jsp" class="btn">Create a New Post</a>
                <a href="getPosts" class="btn">View All Posts</a>
            </div>
        </section>
    </div>
</body>
</html>