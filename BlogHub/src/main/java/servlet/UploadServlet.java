package servlet;

import java.io.File;
import java.io.IOException;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.apache.commons.io.FilenameUtils;

import dao.MediaDAO;
import model.Media;

@WebServlet("/upload")
public class UploadServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private static final String UPLOAD_DIRECTORY = "uploads";
    
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // Check if the request is multipart
        if (!ServletFileUpload.isMultipartContent(request)) {
            response.getWriter().println("Error: Form must have enctype=multipart/form-data");
            return;
        }
        
        // Configure upload settings
        DiskFileItemFactory factory = new DiskFileItemFactory();
        factory.setSizeThreshold(1024 * 1024 * 5); // 5MB threshold
        factory.setRepository(new File(System.getProperty("java.io.tmpdir")));
        
        ServletFileUpload upload = new ServletFileUpload(factory);
        upload.setFileSizeMax(1024 * 1024 * 50); // 50MB max file size
        
        // Prepare the upload directory path
        String uploadPath = getServletContext().getRealPath("") + File.separator + UPLOAD_DIRECTORY;
        File uploadDir = new File(uploadPath);
        if (!uploadDir.exists()) {
            uploadDir.mkdir();
        }
        
        try {
            // Parse the request
            List<FileItem> formItems = upload.parseRequest(request);
            
            String description = "";
            boolean storeAsBlob = false;
            
            // Extract description field first
            for (FileItem item : formItems) {
                if (item.isFormField()) {
                    if ("description".equals(item.getFieldName())) {
                        description = item.getString();
                    } else if ("storeMethod".equals(item.getFieldName()) && "blob".equals(item.getString())) {
                        storeAsBlob = true;
                    }
                }
            }
            
            // Process file upload
            for (FileItem item : formItems) {
                if (!item.isFormField()) {
                    String fileName = new File(item.getName()).getName();
                    if (fileName.isEmpty()) continue;
                    
                    String fileType = item.getContentType();
                    long fileSize = item.getSize();
                    
                    MediaDAO mediaDAO = new MediaDAO();
                    int mediaId;
                    
                    if (storeAsBlob) {
                        // Store file as BLOB in database
                        Media media = new Media(fileName, "", fileType, fileSize, description);
                        mediaId = mediaDAO.saveMediaAsBlob(media, item.get());
                    } else {
                        // Store file on disk and path in database
                        String uniqueFileName = System.currentTimeMillis() + "_" + fileName;
                        String filePath = uploadPath + File.separator + uniqueFileName;
                        
                        File storeFile = new File(filePath);
                        item.write(storeFile);
                        
                        // Save file path to database
                        String relativePath = UPLOAD_DIRECTORY + File.separator + uniqueFileName;
                        Media media = new Media(fileName, relativePath, fileType, fileSize, description);
                        mediaId = mediaDAO.saveMedia(media);
                    }
                    
                    if (mediaId > 0) {
                        request.setAttribute("message", "File uploaded successfully!");
                    } else {
                        request.setAttribute("message", "Failed to upload file to database.");
                    }
                }
            }
        } catch (Exception ex) {
            request.setAttribute("message", "Error: " + ex.getMessage());
            ex.printStackTrace();
        }
        
        // Redirect to media list page
        response.sendRedirect("list-media.jsp");
    }
}