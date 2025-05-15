package com.postapp.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import com.postapp.model.Post;

public class PostDAO {
    
    public boolean addPost(Post post) {
        String sql = "INSERT INTO posts (title, description, image_path, video_path) VALUES (?, ?, ?, ?)";
        Connection conn = null;
        
        try {
            conn = DatabaseConnection.getConnection();
            PreparedStatement pstmt = conn.prepareStatement(sql);
            pstmt.setString(1, post.getTitle());
            pstmt.setString(2, post.getDescription());
            pstmt.setString(3, post.getImagePath());
            pstmt.setString(4, post.getVideoPath());
            
            int rowsAffected = pstmt.executeUpdate();
            return rowsAffected > 0;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        } finally {
            DatabaseConnection.closeConnection(conn);
        }
    }
    
    public List<Post> getAllPosts() {
        List<Post> posts = new ArrayList<>();
        String sql = "SELECT * FROM posts ORDER BY created_at DESC";
        Connection conn = null;
        
        try {
            conn = DatabaseConnection.getConnection();
            PreparedStatement pstmt = conn.prepareStatement(sql);
            ResultSet rs = pstmt.executeQuery();
            
            while (rs.next()) {
                Post post = new Post();
                post.setPostId(rs.getInt("post_id"));
                post.setTitle(rs.getString("title"));
                post.setDescription(rs.getString("description"));
                post.setImagePath(rs.getString("image_path"));
                post.setVideoPath(rs.getString("video_path"));
                post.setCreatedAt(rs.getTimestamp("created_at"));
                posts.add(post);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            DatabaseConnection.closeConnection(conn);
        }
        
        return posts;
    }
    
    public Post getPostById(int postId) {
        String sql = "SELECT * FROM posts WHERE post_id = ?";
        Connection conn = null;
        Post post = null;
        
        try {
            conn = DatabaseConnection.getConnection();
            PreparedStatement pstmt = conn.prepareStatement(sql);
            pstmt.setInt(1, postId);
            ResultSet rs = pstmt.executeQuery();
            
            if (rs.next()) {
                post = new Post();
                post.setPostId(rs.getInt("post_id"));
                post.setTitle(rs.getString("title"));
                post.setDescription(rs.getString("description"));
                post.setImagePath(rs.getString("image_path"));
                post.setVideoPath(rs.getString("video_path"));
                post.setCreatedAt(rs.getTimestamp("created_at"));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            DatabaseConnection.closeConnection(conn);
        }
        
        return post;
    }
}