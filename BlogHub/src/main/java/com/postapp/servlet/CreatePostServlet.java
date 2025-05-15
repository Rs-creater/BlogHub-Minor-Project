package com.postapp.servlet;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.MultipartConfig;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.Part;

import com.postapp.dao.PostDAO;
import com.postapp.model.Post;

@WebServlet("/createPost")
@MultipartConfig(
    fileSizeThreshold = 1024 * 1024 * 2,  // 2MB
    maxFileSize = 1024 * 1024 * 10,       // 10MB
    maxRequestSize = 1024 * 1024 * 50     // 50MB
)
public class CreatePostServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // Get form data
        String title = request.getParameter("title");
        String description = request.getParameter("description");
        
        // Get file parts
        Part imagePart = request.getPart("image");
        Part videoPart = request.getPart("video");
        
        // Get application upload directories
//        String applicationPath = request.getServletContext().getRealPath("");
//        String imageUploadPath = applicationPath + File.separator + "images";
//        String videoUploadPath = applicationPath + File.separator + "videos";
        String imageUploadPath = "C:\Users\Vijay Patidar\OneDrive\Desktop\bloghub\BlogHub\src\main\webapp\images";  // Use a fixed location
        String videoUploadPath = "C:\\Users\\Vijay Patidar\\OneDrive\\Desktop\\bloghub\\BlogHub\\src\\main\\webapp\\videos";  // Use a fixed location
        
        // Create directories if they don't exist
        File imageDir = new File(imageUploadPath);
        if (!imageDir.exists()) {
            imageDir.mkdirs();
        }
        
        File videoDir = new File(videoUploadPath);
        if (!videoDir.exists()) {
            videoDir.mkdirs();
        }
        
        // Process image upload
        String imagePath = null;
        if (imagePart != null && imagePart.getSize() > 0) {
            String fileName = getSubmittedFileName(imagePart);
            // Generate unique filename to prevent overwrites
            String uniqueFileName = System.currentTimeMillis() + "_" + fileName;
            String fullPath = imageUploadPath + File.separator + uniqueFileName;
            
            try (InputStream input = imagePart.getInputStream()) {
                Files.copy(input, Paths.get(fullPath), StandardCopyOption.REPLACE_EXISTING);
                imagePath = "images" + File.separator + uniqueFileName;
            }
        }
        
        // Process video upload
        String videoPath = null;
        if (videoPart != null && videoPart.getSize() > 0) {
            String fileName = getSubmittedFileName(videoPart);
            // Generate unique filename to prevent overwrites
            String uniqueFileName = System.currentTimeMillis() + "_" + fileName;
            String fullPath = videoUploadPath + File.separator + uniqueFileName;
            
            try (InputStream input = videoPart.getInputStream()) {
                Files.copy(input, Paths.get(fullPath), StandardCopyOption.REPLACE_EXISTING);
                videoPath = "videos" + File.separator + uniqueFileName;
            }
        }
        
        // Create post object
        Post post = new Post(title, description, imagePath, videoPath);
        
        // Save to database
        PostDAO postDAO = new PostDAO();
        boolean success = postDAO.addPost(post);
        
        if (success) {
            request.setAttribute("message", "Post created successfully!");
        } else {
            request.setAttribute("message", "Failed to create post.");
        }
        
        request.getRequestDispatcher("/createPost.jsp").forward(request, response);
    }
    
    // Helper method to extract file name from part header
    private String getSubmittedFileName(Part part) {
        String contentDisp = part.getHeader("content-disposition");
        String[] items = contentDisp.split(";");
        
        for (String item : items) {
            if (item.trim().startsWith("filename")) {
                return item.substring(item.indexOf("=") + 2, item.length() - 1);
            }
        }
        return "";
    }
}