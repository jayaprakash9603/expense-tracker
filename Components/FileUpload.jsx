import React, { useState, useRef } from "react";
import axios from "axios";
import {
  Container,
  Box,
  Button,
  Typography,
  Snackbar,
  CircularProgress,
  Alert,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const FileUpload = () => {
  const [message, setMessage] = useState(""); // To display upload messages
  const [alertOpen, setAlertOpen] = useState(false); // To control Snackbar visibility
  const [alertSeverity, setAlertSeverity] = useState("info"); // Severity of Alert (success, error, etc.)
  const [fileName, setFileName] = useState(""); // Display selected file name
  const [loading, setLoading] = useState(false); // Loading indicator during file upload
  const fileInputRef = useRef(null); // Ref to reset the file input

  // Triggered when file is selected
  const onFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
      onFileUpload(file);
    } else {
      setFileName("");
    }
  };

  // Handles file upload to the server
  const onFileUpload = async (file) => {
    if (!file) {
      setMessage("Please select a file to upload.");
      setAlertSeverity("warning");
      setAlertOpen(true);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:3000/expenses/upload", // Update this to your API endpoint
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setMessage(response.data.message || "File uploaded successfully!"); // Ensure the response has a message
      setAlertSeverity("success");
      setAlertOpen(true);
      fileInputRef.current.value = ""; // Clear file input
      setFileName(""); // Clear file name
    } catch (error) {
      setMessage(
        "Failed to upload file: " +
          (error.response?.data?.message || error.message)
      );
      setAlertSeverity("error");
      setAlertOpen(true);
    } finally {
      setLoading(false);
    }
  };

  // Closes the Snackbar
  const handleClose = () => {
    setAlertOpen(false);
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 5, textAlign: "center" }}>
        <input
          accept=".xlsx, .xls" // Restrict file types
          style={{ display: "none" }} // Hide the file input
          id="file-upload"
          type="file"
          ref={fileInputRef}
          onChange={onFileChange}
        />
        <label htmlFor="file-upload">
          <Button
            variant="contained"
            component="span"
            color="primary"
            startIcon={<CloudUploadIcon />}
            disabled={loading}
            sx={{ padding: "10px 20px" }}
          >
            {loading ? (
              <>
                Upload
                <CircularProgress
                  size={24}
                  color="inherit"
                  sx={{ marginLeft: 2 }}
                />
              </>
            ) : (
              "Upload"
            )}
          </Button>
        </label>
        {fileName && (
          <Typography variant="body2" sx={{ mt: 2, color: "gray" }}>
            Selected File: {fileName}
          </Typography>
        )}
        <Snackbar
          open={alertOpen}
          autoHideDuration={3000}
          onClose={handleClose}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={handleClose}
            severity={alertSeverity}
            sx={{ width: "100%" }}
          >
            {message}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
};

export default FileUpload;
