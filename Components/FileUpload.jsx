import React, { useState, useRef } from "react";
import axios from "axios";
import {
  Container,
  Box,
  Button,
  Typography,
  Alert,
  Snackbar,
  CircularProgress,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const FileUpload = () => {
  const [message, setMessage] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState("info");
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const onFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
      onFileUpload(file);
    } else {
      setFileName("");
    }
  };

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
        "http://localhost:3000/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setMessage(response.data);
      setAlertSeverity("success");
      setAlertOpen(true);
      fileInputRef.current.value = ""; // Clear the file input
      setFileName(""); // Clear the file name
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

  const handleClose = () => {
    setAlertOpen(false);
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 5 }}>
        <input
          accept=".xlsx, .xls"
          style={{ display: "none" }}
          id="raised-button-file"
          type="file"
          ref={fileInputRef}
          onChange={onFileChange}
        />
        <label htmlFor="raised-button-file">
          <Button
            variant="contained"
            component="span"
            color="primary"
            startIcon={<CloudUploadIcon />}
            disabled={loading}
            sx={{ padding: "10px 20px" }}
          >
            <Box display="flex" alignItems="center">
              Upload
              {loading && (
                <CircularProgress
                  size={24}
                  color="inherit"
                  sx={{ marginLeft: 2 }}
                />
              )}
            </Box>
          </Button>
        </label>
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
