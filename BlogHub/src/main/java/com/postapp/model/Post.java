package com.postapp.model;

import java.sql.Timestamp;

public class Post {
    private int postId;
    private String title;
    private String description;
    private String imagePath;
    private String videoPath;
    private Timestamp createdAt;
    
    public Post() {
    }
    
    public Post(String title, String description, String imagePath, String videoPath) {
        this.title = title;
        this.description = description;
        this.imagePath = imagePath;
        this.videoPath = videoPath;
    }
    
    // Getters and Setters
    public int getPostId() {
        return postId;
    }
    
    public void setPostId(int postId) {
        this.postId = postId;
    }
    
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public String getImagePath() {
        return imagePath;
    }
    
    public void setImagePath(String imagePath) {
        this.imagePath = imagePath;
    }
    
    public String getVideoPath() {
        return videoPath;
    }
    
    public void setVideoPath(String videoPath) {
        this.videoPath = videoPath;
    }
    
    public Timestamp getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }
}