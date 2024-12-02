import React, { useState, useRef } from "react";
import axios from "axios";
import {
  Container,
  Box,
  Button,
  Typography,
  Alert,
  Snackbar,
  TextField,
  Card,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

import "../Styles/FileUpload.css";

const FileUpload = () => {
  const [message, setMessage] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState("info");
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef(null);

  const onFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
    } else {
      setFileName("");
    }
  };

  const onFileUpload = async () => {
    const file = fileInputRef.current.files[0];
    if (!file) {
      setMessage("Please select a file to upload.");
      setAlertSeverity("warning");
      setAlertOpen(true);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

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
    }
  };

  const handleClose = () => {
    setAlertOpen(false);
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 5 }}>
        <Typography variant="h4" gutterBottom>
          Upload Excel File
        </Typography>
        <input
          accept=".xlsx, .xls"
          style={{ display: "none" }}
          id="raised-button-file"
          type="file"
          ref={fileInputRef}
          onChange={onFileChange}
        />
        <Card className="file-upload-div">
          <div className="choose-file">
            <label htmlFor="raised-button-file">
              <div className="choose-button">
                <Button
                  variant="contained"
                  component="span"
                  color="primary"
                  startIcon={<UploadFileIcon />}
                >
                  Select File
                </Button>
              </div>
            </label>
            <div className="file-name">
              {fileName && (
                <Typography variant="body1" sx={{ mt: 1 }}>
                  {fileName}
                </Typography>
              )}
            </div>
          </div>
          <div className="upload-button-div">
            <Box sx={{ mt: 1 }}>
              <div className="upload-button">
                <Button
                  variant="contained"
                  sx={{ margin: 1.2 }}
                  color="primary"
                  onClick={onFileUpload}
                  startIcon={<CloudUploadIcon />}
                >
                  Upload
                </Button>
              </div>
            </Box>
          </div>
        </Card>
        <Snackbar
          open={alertOpen}
          autoHideDuration={3000}
          onClose={handleClose}
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
