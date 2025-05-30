package com.postapp.servlet;

import java.io.IOException;
import java.util.List;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import com.postapp.dao.PostDAO;
import com.postapp.model.Post;

@WebServlet("/getPosts")
public class GetPostsServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        PostDAO postDAO = new PostDAO();
        List<Post> posts = postDAO.getAllPosts();
        
        request.setAttribute("posts", posts);
        request.getRequestDispatcher("/viewPosts.jsp").forward(request, response);
    }
}