<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Create New Post</title>
    <link rel="stylesheet" href="style/style.css">
</head>
<body>
    <div class="container">
        <header>
            <h1>Create New Post</h1>
            <nav>
                <ul>
                    <li><a href="home.jsp">Home</a></li>
                    <li><a href="createPost.jsp">Create Post</a></li>
                    <li><a href="getPosts">View Posts</a></li>
                </ul>
            </nav>
        </header>
        
        <%-- Display messages if any --%>
        <% if(request.getAttribute("message") != null) { %>
            <div class="message success">
                <%= request.getAttribute("message") %>
            </div>
        <% } %>
        
        <section>
            <form id="postForm" action="createPost" method="post" enctype="multipart/form-data">
                <div class="form-group">
                    <label for="title">Title</label>
                    <input type="text" id="title" name="title" required>
                </div>
                
                <div class="form-group">
                    <label for="description">Description</label>
                    <textarea id="description" name="description" required></textarea>
                </div>
                
                <div class="form-group">
                    <label for="image">Upload Image</label>
                    <input type="file" id="image" name="image" accept="image/*">
                    <div id="previewImageContainer" style="display: none; margin-top: 10px;">
                        <img id="previewImage" src="#" alt="Image Preview" style="max-width: 100%; max-height: 200px;">
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="video">Upload Video</label>
                    <input type="file" id="video" name="video" accept="video/*">
                    <div id="previewVideoContainer" style="display: none; margin-top: 10px;">
                        <video id="previewVideo" controls style="max-width: 100%; max-height: 300px;">
                            Your browser does not support the video tag.
                        </video>
                    </div>
                </div>
                
                <div class="form-group">
                    <button type="submit" class="btn">Create Post</button>
                </div>
            </form>
        </section>
    </div>
    
    <script src="js/script.js"></script>
</body>
</html>